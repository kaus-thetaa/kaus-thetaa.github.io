const {chromium}=require('playwright');
const {default:AxeBuilder}=require('@axe-core/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||(require('node:fs').existsSync('/opt/google/chrome/chrome')?'/opt/google/chrome/chrome':undefined),args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
 const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
 console.log('Accessibility violations:',audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));
 await page.getByRole('button',{name:'Flight',exact:true}).click();
 assert.equal(await page.locator('.work-item:visible').count(),1);
 assert.match(await page.locator('.work-item:visible').innerText(),/Static Fire/);
 await page.getByRole('button',{name:'All 05',exact:true}).click();
 assert.equal(await page.locator('.work-item:visible').count(),5);
 await page.getByRole('link',{name:'Journey',exact:true}).click();
 assert.equal(await page.locator('.journey-entry').count(),5);
 await page.getByRole('link',{name:'2025',exact:true}).press('Enter');
 await page.waitForFunction(()=>document.querySelector('.active-year').textContent==='2025');
 await page.getByRole('link',{name:'Explore ORBIT Gesture Studio',exact:true}).click();
 assert.match(await page.title(),/ORBIT/);
 for(const width of [360,390,768,1024,1440,1920]){
  await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});
 assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('lenis')),false);
 const noJS=await browser.newPage({javaScriptEnabled:false});await noJS.goto('http://127.0.0.1:8000/');
 assert.equal(await noJS.locator('.work-media').count(),5);assert.equal(await noJS.locator('.journey-entry').count(),5);
 console.log('Browser errors:',errors);assert.equal(errors.length,0);assert.equal(audit.violations.length,0);
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
