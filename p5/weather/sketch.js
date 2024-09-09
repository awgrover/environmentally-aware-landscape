let img;
let screen = [2000,1000];
let cloudLocation = [1000,500]
let cloudSize = [800,900]
let data1_dots; // DotSet_t move ...
let displayed; // displayed canvas
let static_background; // cache the background
let DotScale = 270;

function Dots_t() {
  return {
    'loaded' : false,
    'images' : []
  };
};
function DotSet_t(image, location) {
  return {
    'image' : image,
    'location' : elliptical_position(location, cloudLocation, cloudSize),
    'offset' : 0
  };
}


let dots = {
  // subdir : Dots_t
}


function preload() {

  img = loadImage('background.JPG');
  load_dots('cloud');

}

function setup() {
  createCanvas( screen[0],screen[1] );
  displayed = createGraphics(screen[0],screen[1]);
  displayed.clear(); // transparent
  static_background = createGraphics(screen[0],screen[1]);

  while (! dots['cloud']['done'] ) {}
  print("Loaded");

  displayed.background(40,0,0,0);
  static_background.background(220);
  // 1995,4027
  const scale = 2;
  static_background.image(img, 0, 0, 4027/scale, 1995/scale);

  // need a "background" cloud
  //static_dots(static_background, 'cloud', cloudLocation, cloudSize, 400);

  //fill(0,0,0,100);
  //static_background.ellipse(cloudLocation[0]+cloudSize[0]/2, cloudLocation[1]+cloudSize[1]/2, cloudSize[0], cloudSize[1]);

  image(static_background,0,0);

  // Sets of dots
  data1_dots = dot_set( 10, 'cloud', cloudLocation );
  
  //clear(); // transparent background
}

let last_done = 0;
let first_time = true;

function draw() {

  const dot_time = 2000;
  if(millis() - last_done > dot_time) {
    image(static_background,0,0);

    displayed.clear();
    displayed.background(0,0,0,0);

    print("Rand...");
    // given a value, animate a dot
    let data1 = 5.0;
    animate_dots( displayed, data1_dots, data1 ); // write/pick your animation for this set

    //draw_one_dot(displayed, 'cloud', cloudLocation, cloudSize);

    last_done = millis();
  }

  // hackish, the draw_one_dot fetch/image can take time, so we just show what we got
  image(displayed,0,0);
}

function animate_dots( a_canvas, dot_list, value ) {
  print('Animate...');
  for ( let dot of dot_list ) {
    print(dot);
    if ( dot['offset'] < 0 ) { dot['offset'] = value; }
    else  { dot['offset'] = - value; }

    print(`Animate ${dot['location']} ${dot['offset']}`);
    a_canvas.image( dot['image'], dot['location'][0] + dot['offset'], dot['location'][1], DotScale,DotScale );
  }
}

function load_dots(sub_dir) {
  loadStrings(sub_dir + '/index.txt', names => {
    // cleanup
    if ( [names.length-1] == "" ) { names.pop(); } // not working
    names.pop(); // we always have an empty at end of list
    _load_dots(sub_dir, names);
  });
}

function _load_dots(sub_dir, dot_names) {
  print(`load ${sub_dir}`);
  dots[sub_dir] = Dots_t();
  let dots_list = dots[sub_dir]['images'];
  print(`  for ${dot_names}`);
  for( let dot_img of dot_names ) {    
    loadImage(sub_dir + '/' + dot_img,
      dot => {
        dots_list.push( dot );
        print(`Loaded ${sub_dir} ${dots_list.length} ${dot_img}`);
        if (dots_list.length == dot_names.length) {
          dots[sub_dir]['done'] = true;
        }
      }
    );
  }
  print(`... spawned for ${sub_dir}`);
}

function static_dots(a_canvas, sub_dir, center,size, n) {
  print(`Dots [${sub_dir}] ${n} @ ${size}`);
  for(let i = 0; i < n; i++) {
    draw_one_dot(a_canvas, sub_dir, center,size);
  }
}

function dot_set( n, sub_dir, location ) {
  l=[];
  for (let i=0; i<n; i++) {
    l.push( DotSet_t(
      random( dots[sub_dir]['images'] ),
      location
      )
    );
  }
  return l;
}

function draw_one_dot(a_canvas, sub_dir, center,size) {
    // random dot from the cloud list: dots[...]
    dot = random( dots[sub_dir]['images'] );
    let pos = elliptical_position( center, size );
    if ( ! dots[sub_dir]['done'] ) { print(`NOT loaded cloud`); }
    print(`dot ${sub_dir} || ${size} @ ${pos} ${dot}`);
    print( a_canvas == static_background );
    a_canvas.image(dot, pos[0],pos[1], DotScale,DotScale); 
}

function elliptical_position(e_center,e_size) {
  // Random position within the ellipse
  let angle = random(TWO_PI); // Random angle in radians
  let radius = random(1); // Random distance from the e_center
  let x = e_center[0] + (cos(angle) * radius * (e_size[0] / 2));
  let y = e_center[1] + (sin(angle) * radius * (e_size[1] / 2));
  return [x,y]
}
