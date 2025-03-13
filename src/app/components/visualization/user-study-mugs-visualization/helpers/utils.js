//
//   Begin of Utility functions
//

const constants = {
  rectWidth: 30,
  compressed: 10
}

function separateTicks(t, i, length, dim, separation = 1) {
  let skip = Math.round((length * separation) / (dim * 2));
  skip = Math.max(1, skip);
  return (i % skip === 0) ? t : null;
}

//
//  End of Utility functions
//

export {constants, separateTicks}
