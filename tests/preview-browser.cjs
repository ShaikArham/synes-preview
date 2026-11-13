const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const http=require('node:http');
const server=spawn('python3',['-m','http.server','18789','--bind','127.0.0.1'],{stdio:'ignore'});
const base='http://127.0.0.1:18789/overview.html';
async function ready(){for(let n=0;n<50;n++){try{await new Promise((yes,no)=>http.get(base,r=>{r.resume();r.statusCode===200?yes():no(Error('HTTP '+r.statusCode))}).on('error',no));return}catch{await new Promise(r=>setTimeout(r,100))}}throw Error('Static preview not served')}
(async()=>{await ready();const browser=await chromium.launch({headless:true});try{
for(const width of [320,390,768,1440]){
 const ctx=await browser.newContext({viewport:{width,height:850}}),page=await ctx.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:18789/'))requests.push(r.url())});
 await page.goto(base);await page.getByText(/Browser-only synthetic simulation/).first().waitFor();
 assert.equal(await page.locator('[data-incident]').count(),3);
 await page.locator('[data-scenario="401"]').click();await page.locator('#queue-count').getByText(/4 simulated incidents|5 simulated incidents/).waitFor();
 assert.equal(await page.locator('[data-incident]').count(),4);
 assert.equal(await page.locator('#verify').isDisabled(),true);
 await page.locator('#diagnose').click();await page.locator('#api-message').getByText(/diagnose recorded/).waitFor();
 assert.equal(await page.locator('#verify').isDisabled(),true);
 await page.locator('#approve').click();await page.locator('#api-message').getByText(/approve recorded/).waitFor();
 assert.equal(await page.locator('#verify').isEnabled(),true);
 await page.locator('#verify').click();await page.locator('#api-message').getByText(/verify recorded/).waitFor();
 assert.match(await page.locator('#incident-status').innerText(),/Recovery verified/);
 await page.locator('[data-scenario="422"]').click();await page.locator('#queue-count').getByText(/5 simulated incidents/).waitFor();
 await page.locator('#diagnose').click();await page.locator('#api-message').getByText(/diagnose recorded/).waitFor();
 await page.locator('#reject').click();await page.locator('#api-message').getByText(/reject recorded/).waitFor();
 assert.equal(await page.locator('#verify').isDisabled(),true);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'overflow at '+width);
 if(width<=720){await page.locator('#menu').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'false')}
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[],'unexpected external request');
 console.log('PASS '+width);await ctx.close();
}
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.kill());
