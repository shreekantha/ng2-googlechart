# ng2-googlechart

<h3>Step 1:Add the following code into your index.html</h3>
<pre>&lt;<span class="pl-ent">script</span><span class="pl-e"> src</span>=<span class="pl-s"><span class="pl-pds">"</span>https://www.google.com/jsapi<span class="pl-pds">"</span></span>&gt;&lt;/<span class="pl-ent">script</span>&gt;</pre>

<pre>&lt;<span class="pl-ent">script</span> &gt;
 google.load('visualization', '1.0', {
    'packages': ['corechart']
  });
  &lt;/<span class="pl-ent">script</span>&gt;</pre>

<h3>Step 2:Install ng2-googlechart into your project</h3>

<pre>npm install ng2-googlechart --save</pre>

<h3>Step 3:Add following code into angular.cli.build.json</h3>

<pre>'ng2-googlechart/**/*.js'</pre>
<p>
<h3>Step 4:Add following code into system.config.ts file</h3>
<pre>
const map: any = {
  'ng2-googlechart':'vendor/ng2-googlechart'
};

const packages: any = {
  'ng2-googlechart':{
    main:'ng2-googlechart/ng2-googlechart.js'
  }
}
</pre>
</p>
