const planck = require('planck-js')

export default function(players, ballPoint, playerNum, piece, force, angle) {
  var pl = planck, Vec2 = pl.Vec2, Math = pl.Math;

  var SPI4 = Math.sin(Math.PI / 4), SPI3 = Math.sin(Math.PI / 3);

  var width = 10.00, height = 6.00;

  var PLAYER_R = 0.35;
  var BALL_R = 0.23;

  pl.internal.Settings.velocityThreshold = 0;

  var world = pl.World({});

  var walls = [
    Vec2(-width * .5 +0.2, -height * .5),
    Vec2(-width * .5, -height * .5 +0.2),
    Vec2(-width * .5, -height * .2),
    Vec2(-width * .6, -height * .2),
    Vec2(-width * .6, +height * .2),
    Vec2(-width * .5, +height * .2),
    Vec2(-width * .5, +height * .5 -.2),
    Vec2(-width * .5 +.2, +height * .5),
    Vec2(+width * .5 -.2, +height * .5),
    Vec2(+width * .5, +height * .5 -.2),
    Vec2(+width * .5, +height * .2),
    Vec2(+width * .6, +height * .2),
    Vec2(+width * .6, -height * .2),
    Vec2(+width * .5, -height * .2),
    Vec2(+width * .5, -height * .5 +.2),
    Vec2(+width * .5 -.2, -height * .5)
  ];

  var goal = [
    Vec2(0, -height * 0.2),
    Vec2(0, +height * 0.2)
  ];

  var wallFixDef = {
    friction: 0,
    restitution: 0,
    userData : 'wall'
  };
  var goalFixDef = {
    friction: 0,
    restitution: 1,
    userData : 'goal'
  };

  var ballFixDef = {
    friction: .2,
    restitution: .99,
    density: .5,
    userData : 'ball'
  };
  var ballBodyDef = {
    bullet: true,
    linearDamping : 3.5,
    angularDamping : 1.6
  };

  var playerFixDef = {
    friction: .1,
    restitution: .99,
    density: .8,
    userData : 'player'
  };
  var playerBodyDef = {
    bullet: true,
    linearDamping : 4,
    angularDamping : 1.6
  };

  world.createBody().createFixture(pl.Chain(walls, true), wallFixDef);

  world.createBody(Vec2(-width * 0.5 - BALL_R, 0)).createFixture(pl.Chain(goal), goalFixDef);
  world.createBody(Vec2(+width * 0.5 + BALL_R, 0)).createFixture(pl.Chain(goal), goalFixDef);

  var ball = world.createDynamicBody(ballBodyDef);
  ball.createFixture(pl.Circle(BALL_R), ballFixDef);
  ball.setPosition(toVector(ballPoint))
  ball.render = {fill: 'white', stroke : 'black'};

  let pushedBody = null;

  row(0).forEach(function(p, i) {
    var player = world.createDynamicBody(playerBodyDef);
    player.setPosition(toVector(p));
    player.createFixture(pl.Circle(PLAYER_R), {
      ...playerFixDef,
      userData: { type: 'piece', player: 0, piece: i }
    });
    // player.setUserData('p0')
    player.render = {fill : '#0077ff', stroke: 'black'};
    if (piece == i && playerNum == 0) {
      pushedBody = player;
    }
  });

  row(1).forEach(function(p, i) {
    var player = world.createDynamicBody(playerBodyDef);
    player.setPosition(toVector(p));
    player.setAngle(Math.PI);
    player.createFixture(pl.Circle(PLAYER_R), {
      ...playerFixDef,
      userData: { type: 'piece', player: 1, piece: i }
    });
    // player.setUserData('p1')
    player.render = {fill : '#ff411a', stroke: 'black'};
    if (piece == i && playerNum == 1) {
      pushedBody = player;
    }
  });


  const forceVector = Vec2(1000 * force * Math.cos(angle), 1000 * force * Math.sin(angle));
  pushedBody.applyForceToCenter(forceVector)

  world.on('post-solve', function(contact) {
    var fA = contact.getFixtureA(), bA = fA.getBody();
    var fB = contact.getFixtureB(), bB = fB.getBody();

    var wall = fA.getUserData() == wallFixDef.userData && bA || fB.getUserData() == wallFixDef.userData && bB;
    var ball = fA.getUserData() == ballFixDef.userData && bA || fB.getUserData() == ballFixDef.userData && bB;
    var goal = fA.getUserData() == goalFixDef.userData && bA || fB.getUserData() == goalFixDef.userData && bB;

    // do not change world immediately
    setTimeout(function() {
      pushedBody.applyForceToCenter(forceVector)
      if (ball && goal) {
        ball.setPosition(Vec2(0, 0));
        ball.setLinearVelocity(Vec2(0, 0));
        // world.destroyBody(ball);
      }
    }, 1);
  });



  return world;

  function toVector(point) {
    return Vec2(point.x-5, point.y-3)
  }

  function row(isLeft) {
    const player = players[Object.keys(players)[isLeft]]
    return player.pieces.map(piece => {
     return toVector(piece)
    })
  }

  function scale(x, y) {
    return function (v) {
      return pl.Vec2(v.x * x, v.y * y);
    };
  }

  function translate(x, y) {
    return function (v) {
      return pl.Vec2(v.x + x, v.y + y);
    };
  }

};