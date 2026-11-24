const {chromium}=require('playwright');
const {default:AxeBuilder}=require('@axe-core/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/opt/google/chrome/chrome',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://localhost:8000/',{waitUntil:'networkidle'});await page.screenshot({path:'artifacts/desktop.png',fullPage:true});
 const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();console.log('Axe violations',JSON.stringify(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));
 await page.getByRole('button',{name:'Flight',exact:true}).click();assert.equal(await page.locator('[data-project]:visible').count(),1);assert.match(await page.locator('#project-screen').innerText(),/Static Fire/);
 await page.getByRole('button',{name:'All',exact:true}).click();await page.locator('[data-project="orbit-gesture-studio"]').click();assert.match(await page.locator('#project-screen').innerText(),/ORBIT Gesture/);
 await page.getByRole('link',{name:'Explore project',exact:true}).click();assert.match(await page.title(),/ORBIT/);assert.equal(await page.locator('h1').count(),1);
 const caseAudit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();console.log('Project axe violations',caseAudit.violations.map(v=>v.id));
 for(const width of [360,390,768,1024,1440,1920]){await page.setViewportSize({width,height:900});await page.goto('http://localhost:8000/',{waitUntil:'networkidle'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Horizontal overflow at ${width}`);console.log('Layout OK',width);if(width===390)await page.screenshot({path:'artifacts/mobile.png',fullPage:true});}
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.skip-intro').isVisible(),false);await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Skip to content');await page.keyboard.press('Enter');console.log('Reduced motion and skip link OK');
 const nojs=await browser.newPage({javaScriptEnabled:false});await nojs.goto('http://localhost:8000/');assert.equal(await nojs.locator('noscript a').count(),5);console.log('No-JS project links OK');
 console.log('Browser errors',errors);assert.equal(errors.length,0);assert.equal(audit.violations.length,0);assert.equal(caseAudit.violations.length,0);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
