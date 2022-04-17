// GENERATE A WORKOUT
/*
* Workouts should consist of
* 1. Stretching
* 2. Large Set
* 3. Multiple Smaller Sets w/ 30-60s Breaks
*
*/

const workoutNames = ["The Flab-Gobbler",
  "The Waist-Whittler",
  "The Gut-Buster",
  "The Thigh-Blaster",
  "The Butt-Kicker",
  "The Cardio King",
  "The Muscles-Maker",
  "The Tone-Tightener",
  "The Stomach-Shrinker",
  "The Leg-Lifter",
  "The Calorie-Burner",
  "The Endorphin-Releaser",
  "The Energy-Booster",
  "The Stamina-Sustainer",
  "The Strength-Builder",
  "The Mood-Lifter",
  "The Confidence-Booster",
  "The Health-Improver",
  "The Life-Changer",
  "The Body-Transformer"
];
const workouts = [
  "[r30,03]20 Push-Ups",
  "[r30,03]30 Crunches",
  "[r30,03]15 Squats",
  "[r15,01]30 Second Plank",
  "[r30,04]10 Burpees",
  "[r30,03]15 Squat Jumps",
  "[r30,01]30 Bicycle Crunch",
  "[r15,01]20 Jumping Jacks",
  "[r30,01]60 Second Plank"
];


// 3D Initialization
const scene = new THREE.Scene();
let man;

const loadModel = function (modelName) {
  if (man) scene.remove(man);
  const loader = new THREE.FBXLoader();
  loader.load(
    '/animations/' + modelName + '.fbx',
    function (object) {
      object.traverse(function (child) {
        if (child.material) {
          child.material = new THREE.MeshLambertMaterial({
            color: 0xcfe1ff,
            wireframe: false
          });
        }
      });
      man = object;
      man.scale.set(0.03, 0.03, 0.03);
      man.mixer = new THREE.AnimationMixer(man);
      man.mixer.clipAction(man.animations[0]).play();
      scene.add(man);
    }
  );
}


// Utility
const cleanString = function (s)
{
  s = s.replace("-", " ");
  s = s.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  return s.replace(" ", "-");
}

const timer = ms => new Promise(res => setTimeout(res, ms))

const setBar = function(t)
{
  document.querySelector("#current-workout").innerHTML = t;
}

const generateWorkout = function () {
  // First, select a random name
  let name = workoutNames[Math.floor(Math.random() * workoutNames.length)];
  console.log("Workout Name: " + name);
  let pageTitle = document.querySelector("#pageTitle");
  pageTitle.innerHTML = name;
  pageTitle.style.animationDelay = "1s";
  pageTitle.style.opacity = 0;

  // Second, choose some exercise reps
  let reps = [];
  for (let i = 0; i < 5; i++) {
    // activity
    let choice = workouts[Math.floor(Math.random() * workouts.length)];
    let hasRest = choice.substring(1, 2) == "r";

    reps.push(choice);
    workouts.splice(workouts.indexOf(choice), 1);

    // break
    if (hasRest) {
      let restTime = choice.substring(2, 4);
      if (restTime != "00") {
        reps.push("[b00,00]" + restTime + "-Second Rest");
      }
    }
  }

  // append to document
  let list = document.querySelector("#activities-list");
  for (let i = 0; i < reps.length; i++) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(reps[i].substring(8, reps[i].length)));
    if (reps[i].substring(1, 2) == "b") {
      li.style.fontSize = "85%";
      li.style.color = "#c9bad6";
    }
    li.style.opacity = 0;
    li.style.animationDelay = (i+2) + "s";
    list.appendChild(li);
  }
  
 setBar("Preparing . . .");
  setTimeout(function() {
    startWorkout();
  }, 1000 * reps.length);
  
  console.log(reps);

  // Start Workout
  const startWorkout = async function ()
  {
    setBar("Get Ready . . .");
    await timer(3000);
    for (let i = 0; i < reps.length; i++)
    {
      if (reps[i].substring(1, 2) == "b") continue;
      let oneRepLength = parseFloat(reps[i].substring(5, 7));
      let wkName = cleanString(reps[i].substring(8,reps[i].length));
      console.log(wkName);

      let time = parseInt(wkName.substring(0,2));
      console.log("TIME: " + time);

      for (let t = time; t > 0; t--)
      {
        setBar(t + " " + wkName.substring(3, wkName.length));
        await timer(oneRepLength * 1000);
      }
    }
  }
}

generateWorkout();

// RENDERING WORLD
const createScene = function () {
  const clock = new THREE.Clock();

  let width = window.innerWidth * 0.824;
  let height = window.innerHeight;

  // The camera
  const camera = new THREE.PerspectiveCamera(
    45,
    width / height,
    1,
    10000
  );

  // The renderer: something that draws 3D objects onto the canvas
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setClearColor(0x17191a, 1);
  // fix resizing
  window.addEventListener("resize", () => {
    width = window.innerWidth * 0.824;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  // Append the renderer canvas into <body>
  document.querySelector("#content").appendChild(renderer.domElement);

  // Grid Floor
  const gridHelper = new THREE.GridHelper(10, 15);
  scene.add(gridHelper);

  // Lighting
  const light = new THREE.DirectionalLight(0xcfe1ff, 0.75);
  light.position.set(0, 0, 10);
  scene.add(light);

  const ambience = new THREE.AmbientLight(0xcfe1ff, 0.15);
  ambience.position.set(0, 0, 10);
  scene.add(ambience);

  // ThreeJS load FBX file with animations

  loadModel("idle");

  camera.position.y = 3;
  camera.position.z = 10;
  camera.rotation.x = -0.12;

  function render() {
    // Render the scene and the camera
    renderer.render(scene, camera);

    var delta = clock.getDelta();

    if (man) {

      man.mixer.update(delta);

    }

    // Make it call the render() function about every 1/60 second
    requestAnimationFrame(render);
  }

  render();
}
createScene();