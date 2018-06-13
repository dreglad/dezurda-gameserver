const planck = require('planck-js')

export default function(players, player, ballPoint, playerNum, piece,
                        force, angle, forceX, forceY, wallRestitution, state) {
  var pl = planck, Vec2 = pl.Vec2, Math = pl.Math;

  var width = 9.08, height = 6.00;

  var PLAYER_R = 0.35;
  var BALL_R = 0.23;

  pl.internal.Settings.velocityThreshold = 0;

  var world = pl.World({});

  var walls = [
    Vec2(-width * .5, -height * .5),
    Vec2(-width * .5, -height * .5),
    Vec2(-width * .5, -height * .2),

    // portería izquierda
    Vec2(-width * .6, -height * .2),
    Vec2(-width * .6, +height * .2),

    Vec2(-width * .5, +height * .2),
    Vec2(-width * .5, +height * .5),
    Vec2(-width * .5, +height * .5),
    Vec2(+width * .5, +height * .5),
    Vec2(+width * .5, +height * .5),
    Vec2(+width * .5, +height * .2),

    // Portería derecha
    Vec2(+width * .6, +height * .2),
    Vec2(+width * .6, -height * .2),

    Vec2(+width * .5, -height * .2),
    Vec2(+width * .5, -height * .5),
    Vec2(+width * .5, -height * .5)
  ];

  var goal = [
    Vec2(0, -height * 0.2),
    Vec2(0, +height * 0.2)
  ];

  var wallFixDef = {
    friction: 0.2,
    restitution: wallRestitution || 0.3,
    userData : 'wall'
  };
  var goalLFixDef = {
    friction: 0,
    restitution: 1,
    userData : 'goalL'
  };
  var goalRFixDef = {
    friction: 0,
    restitution: 1,
    userData : 'goalL'
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

  world.createBody(Vec2(-width * 0.5 - 2*BALL_R, 0)).createFixture(pl.Chain(goal), goalLFixDef);
  world.createBody(Vec2(+width * 0.5 + 2*BALL_R, 0)).createFixture(pl.Chain(goal), goalRFixDef);

  var ball = world.createDynamicBody(ballBodyDef);
  ball.createFixture(pl.Circle(BALL_R), ballFixDef);
  ball.setPosition(toVector(ballPoint))
  ball.render = {fill: 'white', stroke : 'black'};

  let pushedBody = null;

  row(0).forEach(function(p, i) {
    var player = world.createDynamicBody(playerBodyDef);
    player.setPosition(p);
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

  if (row(1)) {
    row(1).forEach(function(p, i) {
      var player = world.createDynamicBody(playerBodyDef);
      player.setPosition(p);
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
  }

  let forceVector;
  if (forceX != null && forceY != null && !isNaN(forceX) && !isNaN(forceY)) {
    forceVector = Vec2(forceX, forceY);
  } else {
    const rad = angle * Math.PI / 180
    forceVector = Vec2(1000 * force * Math.cos(rad), 1000 * force * Math.sin(rad));
  }

  if (true) {
    // Desactivado
    pushedBody.applyForceToCenter(forceVector, true)
  } else {
    // https://github.com/shakiba/planck.js/blob/master/lib/Body.js#L839-L852
    pushedBody.applyLinearImpulse(forceVector, pushedBody.getWorldCenter(), true)
  }

  let scored = false;

  world.on('post-solve', function(contact) {
    if (scored) {
      console.log('skipping double post-solve / goal')
      return;
    }
    var fA = contact.getFixtureA(), bA = fA.getBody();
    var fB = contact.getFixtureB(), bB = fB.getBody();

    var wall = fA.getUserData() == wallFixDef.userData && bA || fB.getUserData() == wallFixDef.userData && bB;
    var ball = fA.getUserData() == ballFixDef.userData && bA || fB.getUserData() == ballFixDef.userData && bB;
    var goalL = fA.getUserData() == goalLFixDef.userData && bA || fB.getUserData() == goalLFixDef.userData && bB;
    var goalR = fA.getUserData() == goalRFixDef.userData && bA || fB.getUserData() == goalRFixDef.userData && bB;
    
    // do not change world immediately
    // pushedBody.applyForceToCenter(forceVector)
    setTimeout(function() {
      if (ball && !scored && (goalL || goalR)) {
        scored = true;
        const goalPlayer = Object.values(players).find(player => player.isLeft == !!goalR)
        if (goalPlayer) {
          ball.setPosition(Vec2(0, 0));
          ball.setLinearVelocity(Vec2(0, 0));
          console.log("Gool de", goalPlayer)
          goalPlayer.score++;
          state.reset()
          console.log("Depsues de reset", goalPlayer)
        }
      }
    }, 0);
  });

  return world;

  function toVector(point) {
    return Vec2(point.x-(width/2), point.y-(height/2))
  }

  function row(index) {
    const thePlayer = Object.values(players).find(player => player.isLeft == !index)
    if (thePlayer && thePlayer.pieces) {
      return thePlayer.pieces.map(piece => {
       return toVector(piece)
      })
    }
  }

  function scale(x, y) {
    return function (v) {
      return pl.Vec2(v.x * x, v.y * y);
    };
  }

};