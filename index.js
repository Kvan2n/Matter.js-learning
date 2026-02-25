// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

const container = document.getElementById("container");

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: container.offsetWidth,
        height: container.offsetHeight,
    }
});


const CATEGORIES = {
    default: 0x0001,
    wall: 0x0002
};


// create walls
const offset = 5;
const wallOptions = {
    isStatic: true,
    collisionFilter: {
        category: CATEGORIES.wall,
        mask: CATEGORIES.default
    }
};



var walls = {
    ground: {
        body: Bodies.rectangle(container.offsetWidth/2, container.offsetHeight+offset, container.offsetWidth, offset*2, wallOptions),
        normal: { x: 0, y: -1 },
    },
    left: {
        body: Bodies.rectangle(-offset, container.offsetHeight/2, offset*2, container.offsetHeight, wallOptions),
        normal: { x: 1, y: 0 },
    },
    right: {
        body: Bodies.rectangle(container.offsetWidth+offset, container.offsetHeight/2, offset*2, container.offsetHeight, wallOptions),
        normal: { x: -1, y: 0 },
    }
};

// add all of the bodies to the world
Composite.add(engine.world, [walls.ground.body, walls.left.body, walls.right.body]);

//mouse

var mouseConstraint = Matter.MouseConstraint.create(engine, {
    element: container,
    constraint: {
        stiffness: 0.3,
        render: {
            visible: false
        }
    }
});

Composite.add(engine.world, mouseConstraint);






// run the renderer
Render.run(render);

//FIX THIS MESS BY USING ONE CATEGORY PER WALL!!
Matter.Events.on(engine, "beforeUpdate", function() {
    Composite.allBodies(engine.world).forEach(body => {
        if (body.velocity.x < 0) {
            walls.right.body.collisionFilter.mask = 0x0000;
        }
        else if (body.velocity.x > 0) {
            body.collisionFilter.mask = CATEGORIES.default;
        }
    });
});





var elements = {};

function newElementToContainer(element, x, y, width, height, color) {
    container.appendChild(element);
    

    element.style.position = "absolute";
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    element.style.width = width + 'px';
    element.style.height = height + 'px';
    element.style.backgroundColor = color;

    var body = Bodies.rectangle(x, y, width, height, { restitution: 0.6, collisionFilter: { category: CATEGORIES.default, mask: CATEGORIES.wall | CATEGORIES.default} });
    elements[body.id] = element;
    Composite.add(engine.world, body);
}


function updateElement(element, body) {
    if (element === undefined) return;

    element.style.left = body.position.x-40+ 'px';
    element.style.top = body.position.y-40+ 'px';
    element.style.transform = 'rotate(' + body.angle + 'rad)';
}








newElementToContainer(document.createElement("div"), 200, 50, 80, 80, "#f00");

function run() {
    window.requestAnimationFrame(run);
    Engine.update(engine, 1000 / 60);

    Composite.allBodies(engine.world).forEach(body => {
        updateElement(elements[body.id], body);
    });

    //updateElement(document.getElementById("boxA"), boxA);
}

setTimeout(run, 0);


// create runner
var runner = Runner.create();

// run the engine
//Runner.run(runner, engine);