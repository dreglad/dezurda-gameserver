planck.testbed('8 Ball', function(testbed) {
  var pl = planck, Vec2 = pl.Vec2, Math = pl.Math;

  var initialLeft = [
    { x: 1.5, y: 2 },
    { x: 1.5, y: 4 },
    { x: 3.0, y: 1 },
    { x: 3.0, y: 5 },
    { x: 3.5, y: 3 }
];

var initialRight = initialLeft.map(function(piece) {
    // Copiar el estado inicial de left, pero en espejo
    return {
        x: Math.abs((10/2) - (piece.x)) + 10/2,
        y: piece.y
    }
});

  var SPI4 = Math.sin(Math.PI / 4), SPI3 = Math.sin(Math.PI / 3);

  var COLORED = false;
  var BLACK = {fill: 'black', stroke: 'white'};
  var WHITE = {fill: 'white', stroke: 'black'};
  var COLORS = [
    {fill: '#ffdd00', stroke: '#000000'},
    {fill: '#ffdd00', stroke: '#ffffff'},
    {fill: '#ff3300', stroke: '#000000'},
    {fill: '#ff3300', stroke: '#ffffff'},
    {fill: '#662200', stroke: '#000000'}
  ];

  var width = 10.00, height = 6.00;

  var BALL_R = 0.5;
  var POCKET_R = 0.12;

  testbed.x = 0;
  testbed.y = 0;
  testbed.width = width;
  testbed.height = height;
  testbed.ratio = 100
  testbed.mouseForce = -500;

  pl.internal.Settings.velocityThreshold = 0;

  var world = pl.World({});

  var railH = [
    Vec2(POCKET_R, height * .5),
    Vec2(POCKET_R, height * .5 + POCKET_R),
    Vec2(width * .5 - POCKET_R / SPI4 + POCKET_R, height * .5 + POCKET_R),
    Vec2(width * .5 - POCKET_R / SPI4, height * .5)
  ];

  var railV = [
    Vec2(width * .5, -(height * .5 - POCKET_R / SPI4)),
    Vec2(width * .5 + POCKET_R, -(height * .5 - POCKET_R / SPI4 + POCKET_R)),
    Vec2(width * .5 + POCKET_R, height * .5 - POCKET_R / SPI4 + POCKET_R),
    Vec2(width * .5, height * .5 - POCKET_R / SPI4)
  ];

  var railFixDef = {
    friction: 0.05,
    restitution: 0.9,
    userData: 'rail'
  };
  var pocketFixDef = {
    userData: 'pocket'
  };
  var ballFixDef = {
    friction: 0.05,
    restitution: 0.99,
    density: 1,
    userData: 'ball'
  };
  var ballBodyDef = {
    linearDamping: 1.4,
    angularDamping: 1
  };

  world.createBody().createFixture(pl.Polygon(railV.map(scale(+1, +1))), railFixDef);
  world.createBody().createFixture(pl.Polygon(railV.map(scale(-1, +1))), railFixDef);

  world.createBody().createFixture(pl.Polygon(railH.map(scale(+1, +1))), railFixDef);
  world.createBody().createFixture(pl.Polygon(railH.map(scale(-1, +1))), railFixDef);
  world.createBody().createFixture(pl.Polygon(railH.map(scale(+1, -1))), railFixDef);
  world.createBody().createFixture(pl.Polygon(railH.map(scale(-1, -1))), railFixDef);

  world.createBody().createFixture(pl.Circle(Vec2(0, -height * .5 - POCKET_R * 1.5), POCKET_R), pocketFixDef);
  world.createBody().createFixture(pl.Circle(Vec2(0, +height * .5 + POCKET_R * 1.5), POCKET_R), pocketFixDef);

  world.createBody().createFixture(pl.Circle(Vec2(+width * .5 + POCKET_R * .7, +height * .5 + POCKET_R * .7), POCKET_R), pocketFixDef);
  world.createBody().createFixture(pl.Circle(Vec2(-width * .5 - POCKET_R * .7, +height * .5 + POCKET_R * .7), POCKET_R), pocketFixDef);

  world.createBody().createFixture(pl.Circle(Vec2(+width * .5 + POCKET_R * .7, -height * .5 - POCKET_R * .7), POCKET_R), pocketFixDef);
  world.createBody().createFixture(pl.Circle(Vec2(-width * .5 - POCKET_R * .7, -height * .5 - POCKET_R * .7), POCKET_R), pocketFixDef);

  var balls = rack(BALL_R).map(translate(-5, 3));

  // balls.push({x: -width / 2, y: 2.46});

  if (COLORED) {
    shuffleArray(COLORS);
    for (var i = 0; i < COLORS.length; i++) {
      balls[i].render = COLORS[i];
    }
    balls[14].render = balls[4].render;
    balls[4].render = BLACK;
    balls[balls.length - 1].render = WHITE;
  }

  for (i = 0; i < balls.length; i++) {
    var ball = world.createDynamicBody(ballBodyDef);
    ball.setBullet(true);
    ball.setPosition(balls[i]);
    ball.createFixture(pl.Circle(BALL_R), ballFixDef);
    ball.render = balls[i].render;
  }

  var ball = world.createDynamicBody(ballBodyDef);
  var ballPosition = translate(-5, 3)({x: 5, y: -3});
  ball.setBullet(true);
  ball.setPosition(ballPosition);
  ball.createFixture(pl.Circle(0.25), ballFixDef);
  ball.render = ballPosition.render;

  world.on('post-solve', function(contact) {
    var fA = contact.getFixtureA(), bA = fA.getBody();
    var fB = contact.getFixtureB(), bB = fB.getBody();

    var pocket = fA.getUserData() == pocketFixDef.userData && bA || fB.getUserData() == pocketFixDef.userData && bB;
    var ball = fA.getUserData() == ballFixDef.userData && bA || fB.getUserData() == ballFixDef.userData && bB;

    // do not change world immediately
    setTimeout(function() {
      if (ball && pocket) {
        world.destroyBody(ball);
      }
    }, 1);
  });

  return world;

  function rack(pieces) {
    pieces = initialLeft.concat(initialRight);
    var balls = [];
    for (var i=0; i<pieces.length; i++)
      balls.push({
        x: pieces[i].x,
        y: pieces[i].y * -1
      });
    return balls;
  }

  function scale(x, y) {
    return function(v) {
      return pl.Vec2(v.x * x, v.y * y);
    };
  }

  function translate(x, y) {
    return function(v) {
      return pl.Vec2(v.x + x, v.y + y);
    };
  }

  function shuffleArray(array) {
    // http://stackoverflow.com/a/12646864/483728
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

});
