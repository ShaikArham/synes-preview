const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {spawn}=require('node:child_process');
const path=require('node:path');
const fs=require('node:fs');
const artifactDir=path.resolve(__dirname,'../artifacts/browser-qa');
fs.mkdirSync(artifactDir,{recursive:true});
const http=require('node:http');
const server=spawn('python3',['-m','http.server','18789','--bind','127.0.0.1'],{stdio:'ignore',cwd:path.resolve(__dirname,'..')});
const base='http://127.0.0.1:18789/overview.html';
async function ready(){for(let n=0;n<50;n++){try{await new Promise((yes,no)=>http.get(base,r=>{r.resume();r.statusCode===200?yes():no(Error('HTTP '+r.statusCode))}).on('error',no));return}catch{await new Promise(r=>setTimeout(r,100))}}throw Error('Static preview not served')}
(async()=>{await ready();const browser=await chromium.launch({headless:true});try{
for(const width of [320,390,768,1440]){
 const ctx=await browser.newContext({viewport:{width,height:850}}),page=await ctx.newPage(),errors=[],requests=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:18789/'))requests.push(r.url())});
 try {
 await page.goto(base);await page.getByText(/Browser-only synthetic simulation/).first().waitFor();
 assert.equal(await page.locator('a[href="/lab.html"]').count(),1,'Overview must link to Operations Lab');
 assert.equal(await page.locator('#start-tour').isVisible(),true,'guided walkthrough must be visible');
 assert.equal(await page.locator('[data-incident]').count(),3);
 await page.locator('#start-tour').click();await page.waitForFunction(()=>/4 simulated incidents/.test(document.querySelector('#queue-count')?.textContent||''));
 assert.equal(await page.locator('[data-incident]').count(),4);
 assert.equal(await page.locator('#verify').isDisabled(),true);
 await page.locator('#diagnose').click();await page.waitForFunction(action=>(document.querySelector('#api-message')?.textContent||'').includes(action+' recorded'), 'diagnose');
 assert.equal(await page.locator('#verify').isDisabled(),true);
 await page.locator('#approve').click();await page.waitForFunction(action=>(document.querySelector('#api-message')?.textContent||'').includes(action+' recorded'), 'approve');
 assert.equal(await page.locator('#verify').isEnabled(),true);
 await page.locator('#verify').click();await page.waitForFunction(action=>(document.querySelector('#api-message')?.textContent||'').includes(action+' recorded'), 'verify');
 assert.match(await page.locator('#incident-status').innerText(),/Recovery verified/);
 await page.locator('[data-scenario="422"]').click();await page.waitForFunction(()=>/5 simulated incidents/.test(document.querySelector('#queue-count')?.textContent||''));
 await page.locator('#diagnose').click();await page.waitForFunction(action=>(document.querySelector('#api-message')?.textContent||'').includes(action+' recorded'), 'diagnose');
 await page.locator('#reject').click();await page.waitForFunction(action=>(document.querySelector('#api-message')?.textContent||'').includes(action+' recorded'), 'reject');
 assert.equal(await page.locator('#verify').isDisabled(),true);
 await page.locator('[data-scenario="429"]').click();
 await page.waitForFunction(()=>/6 simulated incidents/.test(document.querySelector('#queue-count')?.textContent||''));
 assert.equal(await page.locator('#verify').isDisabled(),true);
 await page.locator('#diagnose').click();
 await page.waitForFunction(()=>(document.querySelector('#api-message')?.textContent||'').includes('diagnose recorded'));
 await page.locator('#tab-decision').click();
 assert.match(await page.locator('#detail').innerText(),/retry-after|request volume/i);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'overflow at '+width);
 if(width<=720){await page.locator('#menu').click();assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('#menu').getAttribute('aria-expanded'),'false')}
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[],'unexpected external request');
 await page.goto('http://127.0.0.1:18789/lab.html');
 await page.getByText(/Investigate synthetic HTTP failures/i).first().waitFor();
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false,'lab overflow at '+width);
 assert.deepEqual(errors,[],'lab JavaScript errors');
 assert.deepEqual(requests,[],'no external requests in Overview or Operations Lab');
 await page.goto(base);
 assert.equal(await page.locator('[data-incident]').count(),3,'browser-only simulation should reset on reload');
 console.log('PASS overview and lab '+width);
 } catch(error) {
  const name='viewport-'+width;
  try {await page.screenshot({path:path.join(artifactDir,name+'.png'),fullPage:true});} catch (_) {}
  fs.writeFileSync(path.join(artifactDir,name+'.txt'),String(error.stack||error)+'\nPage: '+page.url()+'\nErrors: '+errors.join(' | ')+'\nRequests: '+requests.join(' | '));
  throw error;
 } finally {await ctx.close()}
}
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.kill());
