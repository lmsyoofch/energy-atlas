import * as T from './three.module.js';
export function createExplorer(canvas){
const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.setClearColor(0x102f3a,0);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1,.1,160);scene.add(new T.HemisphereLight(0xd8efff,0x46595b,2.2));const sun=new T.DirectionalLight(0xffecd1,3.5);sun.position.set(-10,20,12);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:.1,far:60});sun.shadow.bias=-.001;scene.add(sun);const rim=new T.DirectionalLight(0x8ad8ff,1.7);rim.position.set(10,8,-12);scene.add(rim);
let root=new T.Group(),focus=new T.Vector3(0,3,0),radius=23,part=0,targets=[],active=0,water=null;scene.add(root);const materials=new Map();
function mat(c,metal=.2){let k=c+'-'+metal;if(!materials.has(k))materials.set(k,new T.MeshStandardMaterial({color:c,metalness:metal,roughness:metal>.5?.32:.62}));return materials.get(k)}
function mesh(g,c,pos=[0,0,0],group=root){let o=new T.Mesh(g,mat(c));o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;o.userData.part=part;group.add(o);return o}
function box(p,s,c,group=root){return mesh(new T.BoxGeometry(...s),c,p,group)}
function cyl(p,r,h,c,r2=r,group=root){return mesh(new T.CylinderGeometry(r2,r,h,20),c,p,group)}
function beam(a,b,r,c,group=root){let av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);let o=cyl(av.clone().add(bv).multiplyScalar(.5).toArray(),r,d.length(),c,r,group);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o}
function pipe(points,r=.055,c='#c7d0cf'){for(let i=1;i<points.length;i++)beam(points[i-1],points[i],r,c);points.slice(1,-1).forEach(p=>mesh(new T.SphereGeometry(r,10,8),c,p))}
function rail(x,y,z,w,d){for(let zz of [z-d/2,z+d/2]){for(let xx=x-w/2;xx<=x+w/2+.01;xx+=.5)beam([xx,y,zz],[xx,y+.4,zz],.018,'#e6b64d');for(let yy of [y+.2,y+.4])beam([x-w/2,yy,zz],[x+w/2,yy,zz],.018,'#e6b64d')}for(let xx of [x-w/2,x+w/2])beam([xx,y+.4,z-d/2],[xx,y+.4,z+d/2],.018,'#e6b64d')}
function vessel(x,y,z,r,l){let o=cyl([x,y,z],r,l,'#c7d0d1');o.rotation.z=Math.PI/2;for(let xx of [x-l/2,x+l/2]){let cap=mesh(new T.SphereGeometry(r,20,12),'#bdc8c9',[xx,y,z]);cap.scale.x=.45}for(let xx of [x-l*.3,x+l*.3])box([xx,y-r-.18,z],[.15,.4,r*1.6],'#6c797d');for(let xx=x-l*.3;xx<x+l*.5;xx+=l*.6){const flange=mesh(new T.TorusGeometry(r+.025,.024,6,24),'#6f8187',[xx,y,z]);flange.rotation.y=Math.PI/2}}
function stairs(a,b,w=.6){for(let i=0;i<=10;i++){let t=i/10;box([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],[w,.07,.22],'#919d9d')}for(let side of [-w/2,w/2]){beam([a[0]+side,a[1]+.4,a[2]],[b[0]+side,b[1]+.4,b[2]],.022,'#e5b24a')}}
function sea(level){water=mesh(new T.PlaneGeometry(80,80,60,60),'#164857',[0,level,0]);water.rotation.x=-Math.PI/2;water.material=new T.MeshStandardMaterial({color:'#174e61',metalness:.55,roughness:.27,transparent:true,opacity:.86});water.castShadow=false;let p=water.geometry.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,.028*Math.sin(p.getX(i)*2.1)*Math.cos(p.getY(i)*1.8));water.geometry.computeVertexNormals()}
function land(){box([0,-.3,0],[12,.4,10],'#465e48')}
function helipad(x,y,z,r){const p=cyl([x,y,z],r,.1,'#336c62');const circle=mesh(new T.TorusGeometry(r*.76,.028,6,48),'#f0e8d4',[x,y+.06,z]);circle.rotation.x=Math.PI/2;for(let xx of [-.24,.24])box([x+xx,y+.06,z],[.075,.015,.7],'#f7efe0');box([x,y+.06,z],[.5,.015,.075],'#f7efe0');return p}
function load(id){scene.remove(root);root.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material&&!Array.from(materials.values()).includes(o.material))o.material.dispose()});root=new T.Group();scene.add(root);targets=[];part=-1;water=null;
if(id==='oil'){
focus.set(0,3.4,0);radius=24;sea(-1.8);
part=5;for(let x of [-2.4,2.4])for(let z of [-1.8,1.8]){beam([x*1.3,-3,z*1.3],[x,4,z],.16,'#bd9751');for(let y=-3;y<3;y+=1.65){let k=1+(4-y)*.043,k2=1+(4-y-1.65)*.043;beam([x*k,y,z*k],[-x*k2,y+1.65,z*k2],.065,'#ac8c4b');beam([x*k,y,z*k],[x*k2,y+1.65,-z*k2],.065,'#ac8c4b')}}
part=-1;for(let y of [3.35,4]){box([0,y,0],[7,.16,5.1],'#839293');rail(0,y+.08,0,7,5.1)}for(let x of [-3.3,0,3.3])box([x,3.66,0],[.14,.6,5],'#566f76');stairs([3,3.45,1],[3,4.1,2.4]);
part=0;for(let x of [-2.6,-1.1])for(let z of [-.8,.8]){beam([x,4,z],[-1.85+(x+1.85)*.22,9,z*.22],.065,'#d8b469')};for(let y=4;y<9;y+=.55){let k=1-(y-4)*.156,k2=1-(y+.55-4)*.156;for(let z of [-1,1]){beam([-1.85-.75*k,y,z*.8*k],[-1.85+.75*k2,y+.55,z*.8*k2],.022,'#b7a26e');beam([-1.85+.75*k,y,z*.8*k],[-1.85-.75*k2,y+.55,z*.8*k2],.022,'#b7a26e')}for(let x of [-1,1])beam([-1.85+x*.75*k,y,-.8*k],[-1.85+x*.75*k2,y+.55,.8*k2],.022,'#b7a26e')}
box([-1.85,9.07,0],[.7,.18,.7],'#71828a');beam([-1.85,8.9,0],[-1.85,4.1,0],.035,'#414b51');box([-1.85,4.12,0],[2,.12,2],'#788991');
part=1;for(let z of [-.5,.5]){pipe([[-1.9,-2,z],[-1.9,3.5,z],[-.5,3.5,z]],.085,'#82a5a1');for(let y of [3.1,3.45]){cyl([-1.9,y,z],.14,.08,'#b7bec0');box([-1.9,y+.15,z],[.24,.17,.22],'#586c78')}}
part=2;for(let z of [-1.45,0,1.45]){vessel(1.3,4.6,z,.3,2.1);pipe([[.3,4.9,z],[.3,5.25,z],[2.5,5.25,z],[2.5,3.5,z]],.055,'#bbd2cc')};for(let z of [-2,-1.8])pipe([[-.5,4.18,z],[3,4.18,z],[3,3.1,z]],.075,'#668e94');
part=3;for(let z of [-.15,.15])beam([3,4,z],[6.2,7.8,z*.35],.055,'#9ca8aa');for(let i=0;i<10;i++){let t=i/10;beam([3+3.2*t,4+3.8*t,-.15],[3+3.2*(t+.1),4+3.8*(t+.1),.15],.025,'#889396')};pipe([[3,4,0],[6.2,7.8,0],[6.2,8.2,0]],.075,'#75858b');
part=4;box([-2,4.95,3.25],[2.8,1.7,1.9],'#e1e4db');for(let y of [4.5,5.1,5.6])for(let x=-3.1;x<-1;x+=.38)box([x,y,4.205],[.23,.2,.015],'#284655');helipad(-2,5.9,3.25,1.8);for(let x of [-3,-1])beam([x,4,2],[x,4.5,3.6],.07,'#8b9898');vessel(-.1,3.5,2.9,.18,.7);
part=-1;beam([2.8,4,2],[2.8,6.1,2],.12,'#e0b244');beam([2.8,6.1,2],[4.6,6.8,3],.07,'#d4a549');beam([4.6,6.8,3],[4.6,4.9,3],.012,'#424e56');
targets=[[-1.85,7.6,0],[-1.9,3.2,.5],[1.3,4.9,0],[6.2,8,0],[-2,6,3.3],[2.7,.8,2]];
}else if(id==='flng'){
focus.set(0,1.7,0);radius=23;sea(.05);
part=-1;const outline=new T.Shape();outline.moveTo(-7.1,0);outline.bezierCurveTo(-6.8,-1,-6.2,-1.65,-5.5,-1.7);outline.lineTo(6.2,-1.7);outline.lineTo(6.2,1.7);outline.lineTo(-5.5,1.7);outline.bezierCurveTo(-6.2,1.65,-6.8,1,-7.1,0);const hull=mesh(new T.ExtrudeGeometry(outline,{depth:1.35,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.16,bevelThickness:.15}),'#324c57');hull.rotation.x=-Math.PI/2;hull.position.y=-.5;box([.25,.9,0],[11.9,.12,3.3],'#a9a698');rail(.25,.97,0,11.8,3.2);box([.2,-.27,0],[11.8,.26,3.33],'#743f36');
part=0;cyl([-5.5,1.07,0],.62,.3,'#8b9999');for(let z of [-1,1])pipe([[-5.6,.9,z*.45],[-6,-1,z],[-7.4,-2,z*2]],.055,'#7b8987');
part=1;for(let x of [-4,-3.2]){cyl([x,2.05,-.7],.24,1.95,'#c3ccca');for(let y of [1.4,2,2.7])cyl([x,y,-.7],.28,.055,'#758991')}vessel(-3.7,1.55,.7,.27,1.7);
part=2;for(let x of [-1.8,.3,2.2]){box([x,1.05,-.35],[1.7,.13,2.4],'#929e9a');for(let xx of [x-.7,x+.7])for(let z of [-1.4,.7])beam([xx,1,z],[xx,3.25,z],.042,'#acb5b1');for(let y of [2,3.1]){box([x,y,-.35],[1.65,.065,2.35],'#7e8e8c');rail(x,y+.04,-.35,1.65,2.35)}cyl([x,2,-.6],.32,1.7,'#ccd2d0');vessel(x,1.5,.3,.18,1.2);for(let z of [-.8,-.5])pipe([[x-.6,1.2,z],[x-.6,3.5,z],[x+.6,3.5,z],[x+.6,2.4,z]],.05,'#bfc8c5')}
part=3;for(let x of [-1.8,.3,2.2]){box([x,1.03,1.15],[1.45,.2,.48],'#d8d5bc');cyl([x,1.22,1.15],.14,.3,'#a2b4b0')}
part=4;for(let x of [2.2,2.6,3]){pipe([[x,1,1.5],[x,2.3,1.5],[x,2.7,2.05],[x,2.2,2.7]],.07,'#b6c5c3')}
part=5;box([4.7,2,0],[2,2,2.9],'#d5ddd6');for(let y of [1.5,2.05,2.6])for(let x=3.9;x<5.6;x+=.35)for(let z of [-1.46,1.46])box([x,y,z],[.22,.19,.02],'#233f50');box([4.7,3.12,0],[2.3,.23,3.1],'#9eb4ae');helipad(4.7,3.3,0,1.45);for(let z of [-1,-.6])cyl([3.3,3,z],.14,2.8,'#77868a');
part=-1;beam([-5,1,-1.2],[-7,4.7,-2.2],.07,'#a6b1ae');beam([-4.5,1,-1.4],[-7,4.7,-2.2],.035,'#a6b1ae');targets=[[-5.5,1.4,0],[-3.6,2.8,-.7],[.3,3.5,0],[.3,1.4,1.3],[2.6,2.5,2],[4.7,3.5,0]];
}else if(id==='wind'){
focus.set(0,4.4,0);radius=24;land();part=2;cyl([0,0,0],.85,.25,'#adb2a7');cyl([0,3.9,0],.27,7.6,'#e0e3de',.15);box([0,.4,.29],[.21,.53,.05],'#929e98');part=1;box([0,7.75,-.35],[.78,.65,1.65],'#d8dedb');box([0,8.12,-.6],[.55,.1,.7],'#909d9b');part=0;let hub=mesh(new T.SphereGeometry(.28,24,16),'#e6e9e2',[0,7.75,.63]);hub.scale.z=1.4;for(let i=0;i<3;i++){let group=new T.Group();group.position.set(0,7.75,.68);group.rotation.z=i*2*Math.PI/3+.2;root.add(group);const shape=new T.Shape();shape.moveTo(-.08,.16);shape.lineTo(-.24,.85);shape.quadraticCurveTo(-.19,1.8,.06,3.3);shape.quadraticCurveTo(.17,3.43,.16,3.19);shape.lineTo(.16,1);shape.lineTo(.09,.16);shape.closePath();mesh(new T.ExtrudeGeometry(shape,{depth:.07,bevelEnabled:true,bevelThickness:.025,bevelSize:.025,bevelSegments:2,steps:1}),'#e3e8df',[0,0,0],group)}part=3;box([2,.55,1.2],[1.1,1.1,.9],'#a2afa1');for(let x=1.6;x<2.5;x+=.12)box([x,.65,1.67],[.04,.65,.02],'#697b75');pipe([[0,.04,0],[2,.04,1.2]],.045,'#687b7d');targets=[[0,9.7,.7],[0,7.9,0],[0,3.6,.2],[2,1.2,1.2]];
}else if(id==='solar'){
focus.set(0,.8,0);radius=17;land();for(let x=-3.8;x<1;x+=1.3)for(let z=-2.5;z<3;z+=1.9){part=1;beam([x,0,z-.5],[x,1.38,z-.5],.035,'#98a4a6');beam([x,0,z+.5],[x,1.05,z+.5],.035,'#98a4a6');beam([x-.56,1.23,z],[x+.56,1.23,z],.035,'#8e9b9e');part=0;let panel=new T.Group();panel.position.set(x,1.25,z);panel.rotation.x=.3;root.add(panel);box([0,0,0],[1.2,.065,1.6],'#a3b3bb',panel);box([0,.041,0],[1.12,.018,1.52],'#142d53',panel);for(let a=-.48;a<.6;a+=.2)for(let b=-.65;b<.8;b+=.23){box([a,.054,b],[.184,.006,.21],'#25466f',panel);for(let k of [-.045,.045])box([a+k,.059,b],[.004,.004,.2],'#728d9c',panel)}}part=2;box([2.4,.8,-1.5],[.8,1.6,.7],'#d7dad1');box([2.4,1,-1.13],[.2,.15,.025],'#345e68');part=3;box([3,.85,1.4],[1.5,1.7,1.1],'#b6c1b6');for(let x of [2.65,3.35]){box([x,.85,1.97],[.65,1.52,.02],'#cdd5cb');for(let y=.3;y<.9;y+=.1)box([x,y,2],[.5,.018,.015],'#657971')}targets=[[-2,1.6,-1],[-2,.7,2],[2.4,1.6,-1.5],[3,1.7,1.4]];
}else if(id==='geothermal'){
focus.set(0,.4,0);radius=20;part=-1;
for(let i=0;i<4;i++)box([0,-.5-i*.55,0],[10,.55,6],['#706b52','#897052','#765940','#624733'][i]);box([0,-.15,0],[10,.1,6],'#5d7652');
part=0;pipe([[-3.4,-2.6,.9],[-3.4,.6,.9],[-1.5,.6,.9]],.12,'#b77245');for(let y of [.1,.45])cyl([-3.4,y,.9],.23,.1,'#6b7975');
part=1;vessel(-.9,.9,.9,.36,2);pipe([[-1.8,1.2,.9],[-1.8,1.6,.9],[.5,1.6,.9],[.5,.8,-.8]],.07,'#c9b56e');
part=2;vessel(.8,.65,-.8,.35,1.25);box([1.8,.65,-.8],[.7,.7,.75],'#4b8b80');box([1.1,.17,-.8],[2.7,.18,1.2],'#a2aaa0');
part=3;for(let x of [2.2,3.6]){box([x,1.05,1.35],[1.1,1.9,1.3],'#96a8a0');const ring=mesh(new T.TorusGeometry(.39,.03,8,24),'#556d68',[x,2.02,1.35]);ring.rotation.x=Math.PI/2;for(let i=0;i<4;i++){let a=i*Math.PI/2;beam([x,2.02,1.35],[x+Math.sin(a)*.34,2.02,1.35+Math.cos(a)*.34],.055,'#697b72')}}pipe([[1.5,.7,-.8],[2.7,.7,-.8],[2.7,.7,1.35]],.065,'#87a7b0');pipe([[2.2,.35,1.35],[2.2,.35,2.5],[-.9,.35,2.5],[-.9,.7,.9]],.07,'#87a7b0');
part=4;pipe([[.15,.9,.9],[.15,.5,2.4],[4.3,.5,2.4],[4.3,-2.6,2.4]],.12,'#5894a4');targets=[[-3.4,.7,.9],[-.9,1.4,.9],[1.1,1,-.8],[2.7,2.1,1.35],[4.3,-.7,2.4]];
}else if(id==='tidal'){
focus.set(0,2.5,0);radius=18;part=2;box([0,-.25,0],[10,.35,8],'#69715f');box([0,.05,0],[2,.3,2],'#929b90');cyl([0,1.6,0],.23,3,'#a3afa8');for(let x of [-1,1])for(let z of [-1,1])beam([x,.15,z],[0,1.9,0],.1,'#889b92');
part=1;const nacelle=cyl([0,3.1,-.45],.34,1.65,'#b8c5bd');nacelle.rotation.x=Math.PI/2;
part=0;mesh(new T.SphereGeometry(.3,20,12),'#d4dcd0',[0,3.1,.45]);for(let i=0;i<3;i++){const g=new T.Group();g.position.set(0,3.1,.45);g.rotation.z=i*2*Math.PI/3+.3;root.add(g);const shape=new T.Shape();shape.moveTo(-.1,.12);shape.lineTo(-.3,.6);shape.lineTo(-.1,2);shape.lineTo(.13,2.1);shape.lineTo(.2,.7);shape.lineTo(.1,.12);shape.closePath();mesh(new T.ExtrudeGeometry(shape,{depth:.1,bevelEnabled:true,bevelSize:.04,bevelThickness:.04,bevelSegments:2,steps:1}),'#b7c7bb',[0,0,0],g)}
part=3;pipe([[0,3,-1.1],[0,.15,-1.1],[2,.15,-2],[4.8,.15,-2.5]],.055,'#333f43');box([2,.12,-2],[.65,.2,.45],'#b2ae8f');targets=[[0,4.5,.6],[0,3.3,-.5],[0,1.2,0],[3,.2,-2.2]];
}else if(id==='biomass'){
focus.set(0,1.4,0);radius=20;land();
part=0;cyl([-3.4,1.15,0],.8,2.1,'#b3b7a3');cyl([-3.4,2.4,0],.82,.4,'#8b9a8d',0);const belt=box([-2.25,1,0],[2.3,.22,.5],'#686f60');belt.rotation.z=.35;for(let x=-3;x<-1.3;x+=.25)beam([x,.8,0],[x,1.08,0],.035,'#c5ad62');
part=1;box([-.6,1.5,0],[1.8,2.8,2.1],'#b8c1b4');for(let z of [-.9,.9])for(let x of [-1.4,.2])beam([x,0,z],[x,3,z],.045,'#738882');box([-.6,3.1,0],[2,.14,2.3],'#9aa99a');rail(-.6,3.17,0,2,2.3);pipe([[.2,2.6,0],[1.6,2.6,0],[1.6,.8,1.6]],.09,'#c0c7ba');
part=2;vessel(1.65,.75,1.6,.35,1.3);box([2.7,.75,1.6],[.7,.7,.8],'#568b7e');box([2,.22,1.6],[2.8,.15,1.3],'#a4ab9d');
part=3;box([1.7,1.1,-1.4],[1.25,2,1.2],'#899c91');pipe([[.1,2.3,-.7],[1.7,2.3,-.7],[1.7,2,-1.4],[3.7,2,-1.4]],.19,'#899a91');cyl([3.7,2.4,-1.4],.22,4.8,'#a8b4aa',.17);for(let y of [3.3,3.8,4.3])cyl([3.7,y,-1.4],.2,.18,'#ba7762');
part=4;box([3.3,.65,3],[1.4,1.1,1.1],'#839b90');pipe([[2,.65,1.6],[2,.65,3],[3.3,.65,3]],.065,'#668fa0');pipe([[3.3,.3,3],[-.7,.3,3],[-.7,.3,1]],.055,'#668fa0');targets=[[-3.4,2.6,0],[-.6,3.2,0],[2,1.2,1.6],[3.7,3.8,-1.4],[3.3,1.3,3]];
}else{
focus.set(0,1.3,0);radius=20;land();part=0;box([-1,2.3,-2.8],[7.5,.1,2.8],'#286a7a');let shape=new T.Shape();shape.moveTo(-.2,0);shape.lineTo(.95,0);shape.lineTo(.2,3.5);shape.lineTo(-.2,3.5);shape.closePath();let dam=mesh(new T.ExtrudeGeometry(shape,{depth:7,bevelEnabled:false}),'#a6afa7',[2.5,-.1,-1.3]);dam.rotation.y=-Math.PI/2;rail(-1,3.42,-1.3,7,.4);for(let x=-4;x<2.6;x+=1.2)box([x,1.5,-.65],[.16,3.2,.18],'#8e9994');part=1;pipe([[.7,2.7,-1.2],[.7,2.6,-.7],[.7,.65,1.8]],.24,'#73918e');for(let z of [.3,1,1.7]){let y=2.6-(z+.7)*.78;box([.7,y-.25,z],[.7,.3,.3],'#929d92')}part=2;box([1.7,.25,2],[2.6,.25,2.4],'#aeb8aa');for(let x of [.5,2.9])for(let z of [1,3])beam([x,.3,z],[x,1.65,z],.07,'#b5c2b7');box([1.7,1.8,1.45],[2.8,.15,1.5],'#718e87');cyl([1.3,.85,2],.45,.7,'#5b8e83');cyl([1.3,1.25,2],.37,.2,'#adb7af');for(let i=0;i<8;i++){let a=i*Math.PI/4;beam([1.3,.85,2],[1.3+Math.cos(a)*.48,.85,2+Math.sin(a)*.48],.045,'#c5b478')}part=3;box([2.4,-.04,3.8],[2.1,.1,2.3],'#307b8c');targets=[[-2,3.5,-1.2],[.7,1.7,.5],[1.3,1.25,2],[2.4,.2,3.7]];
}
}
function draw(w,h,yaw,pitch,zoom){if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();let distance=radius/zoom*Math.max(1,1.1/camera.aspect);let elevation=Math.max(.12,pitch+.18);camera.position.set(focus.x+Math.sin(yaw)*Math.cos(elevation)*distance,focus.y+Math.sin(elevation)*distance,focus.z+Math.cos(yaw)*Math.cos(elevation)*distance);camera.lookAt(focus);camera.updateMatrixWorld();renderer.render(scene,camera);return targets.map(p=>{const v=new T.Vector3(...p).project(camera);return [(v.x+1)*w/2,(1-v.y)*h/2,v.z]})}
function setView(ids,isolated,selected){
 const accepted=ids===null?null:new Set(ids);
 root.traverse(o=>{if(!o.isMesh)return;
  if(!o.userData.originalMaterial){o.userData.originalMaterial=o.material;o.material=o.material.clone();}
  const belongs=accepted===null||accepted.has(o.userData.part);
  o.visible=!isolated||belongs;
  o.material.opacity=belongs?o.userData.originalMaterial.opacity:.1;
  o.material.transparent=!belongs||o.userData.originalMaterial.transparent;
  o.material.depthWrite=belongs;
  o.material.emissive.set(o.userData.part===selected?'#936224':'#000000');
  o.material.emissiveIntensity=o.userData.part===selected?.28:0;
  o.castShadow=belongs;
 });
}
function pick(x,y,w,h){const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2(x/w*2-1,1-y/h*2),camera);const hit=ray.intersectObject(root,true).find(h=>h.object.visible&&h.object.material.opacity>.2&&h.object.userData.part>=0);return hit?.object.userData.part??null;}
return {load,draw,setView,pick};}
