// Bind this script to the portfolio spreadsheet. Only publish the Now tab.
function setup() {
  const sheet = SpreadsheetApp.getActive();
  if (!sheet.getSheetByName('Messages')) sheet.insertSheet('Messages').appendRow(['Received', 'Name', 'Email', 'Message']);
  if (!sheet.getSheetByName('Now')) sheet.insertSheet('Now').appendRow(['title', 'status', 'link', 'updated']);
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', sheet.getId());
}
function jsonResponse(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
function doPost(event) {
  let lock;
  try {
    if (!event || !event.postData || event.postData.contents.length > 12000) return jsonResponse({ok:false,error:'Message is too large.'});
    const data=JSON.parse(event.postData.contents);
    if (data.website) return jsonResponse({ok:false,error:'Message could not be sent. Please use email.'});
    const name=String(data.name||'').trim(),email=String(data.email||'').trim(),message=String(data.message||'').trim();
    if (!name || name.length>100 || email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length<10 || message.length>4000) return jsonResponse({ok:false,error:'Check your name, email and message length (10–4000 characters).'});
    lock=LockService.getScriptLock();
    if(!lock.tryLock(5000)) return jsonResponse({ok:false,error:'The inbox is busy. Please try again in a minute.'});
    const cache=CacheService.getScriptCache();
    const key=Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,email.toLowerCase()));
    const count=Number(cache.get('global-minute')||0);
    if(cache.get(key)||count>=10) return jsonResponse({ok:false,error:'Please wait a minute before sending another message.'});
    const id=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    const sheet=SpreadsheetApp.openById(id).getSheetByName('Messages');
    // Prevent submitted text from becoming a spreadsheet formula.
    const plain=value=>/^[=+@\-\t\r]/.test(value)?"'"+value:value;
    sheet.appendRow([new Date(),plain(name),plain(email),plain(message)]);
    cache.put(key,'1',60);cache.put('global-minute',String(count+1),60);
    return jsonResponse({ok:true});
  } catch(error) { return jsonResponse({ok:false,error:'Message could not be saved. Please use the email link.'}); }
  finally { if(lock && lock.hasLock())lock.releaseLock(); }
}
