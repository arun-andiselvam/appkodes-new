/**
 * The land, as coarse polygons in [longitude, latitude].
 *
 * !! WHY THIS IS HAND WRITTEN RATHER THAN A GEOJSON FILE !!
 *
 * There is no map asset in public/ and no charting or geo dependency in
 * package.json. A real Natural Earth outline is about a megabyte of
 * coordinates for a decoration nine hundred pixels wide, which would be the
 * largest file in this repository by a wide margin.
 *
 * So this is a coarse outline, rasterised to dots by
 * components/backgrounds/delivery-map.tsx. The dot grid throws away most of
 * the detail anyway: at two degrees a cell is roughly two hundred kilometres,
 * so a fjord and a straight coast land on the same dot. What has to be right
 * at that size is the silhouette.
 *
 * !! MANY SMALL RINGS, NOT ONE BIG ONE, AND THEY MAY OVERLAP !!
 *
 * The first version drew Eurasia as a single ring and it rendered as a slab
 * with a straight northern edge and no Europe: one polygon cannot hold a
 * coastline that doubles back on itself as often as that one does, and every
 * vertex spent on the Baltic was a vertex not spent on Siberia. The renderer
 * tests a point against every ring and takes the union, so a continent can be
 * assembled from overlapping pieces and each piece can be simple. Split
 * anything that starts needing more than about forty vertices.
 *
 * Precision is worth nothing here. Do not add vertices to smooth a coastline
 * that renders as four dots.
 *
 * Antarctica is missing on purpose, the way it is on most web maps. The
 * component stops at 56 south, which also trims the tail of South America.
 */
export type Ring = [number, number][];

export const landmasses: Ring[] = [
  /* ---------------------------------------------------------------- */
  /* The Americas                                                      */
  /* ---------------------------------------------------------------- */

  /* Alaska and the Yukon. */
  [[-168, 66], [-162, 70], [-156, 71], [-148, 70], [-141, 70], [-141, 60], [-149, 60],
   [-153, 59], [-158, 56], [-165, 60], [-166, 64]],
  /* Canada, west to the Hudson shore. */
  [[-141, 70], [-128, 70], [-115, 70], [-105, 69], [-95, 69], [-95, 61], [-88, 57],
   [-82, 55], [-80, 62], [-78, 68], [-85, 70], [-95, 74], [-105, 74], [-120, 72],
   [-133, 70]],
  /* Eastern Canada and the Maritimes. */
  [[-80, 62], [-70, 62], [-64, 58], [-56, 54], [-53, 48], [-60, 46], [-67, 45],
   [-70, 47], [-78, 52], [-80, 56]],
  /* The United States, lower forty eight. */
  [[-124, 48], [-124, 40], [-121, 35], [-117, 32], [-109, 31], [-103, 29], [-97, 26],
   [-95, 29], [-91, 30], [-88, 30], [-85, 30], [-83, 29], [-82, 26], [-80, 25],
   [-81, 30], [-79, 33], [-76, 35], [-74, 39], [-70, 42], [-67, 45], [-70, 48],
   [-83, 46], [-90, 48], [-100, 49], [-115, 49]],
  /* Mexico and Central America. */
  [[-115, 32], [-110, 24], [-106, 23], [-100, 18], [-96, 16], [-92, 15], [-88, 16],
   [-83, 10], [-79, 9], [-83, 14], [-88, 21], [-90, 21], [-92, 19], [-97, 22],
   [-105, 29]],
  /* The Greater Antilles, one gesture rather than four islands. */
  [[-85, 22], [-77, 20], [-74, 19], [-70, 19], [-66, 18], [-74, 22], [-82, 23]],
  /* South America, north. */
  [[-79, 9], [-72, 12], [-66, 11], [-60, 8], [-53, 5], [-50, 0], [-45, -2],
   [-38, -5], [-35, -8], [-40, -3], [-48, 0], [-52, 3], [-60, 5], [-70, 3],
   [-78, 2], [-81, 4]],
  /* South America, south. */
  [[-81, 4], [-78, 2], [-70, 3], [-60, 5], [-48, 0], [-40, -3], [-35, -8],
   [-38, -13], [-40, -20], [-48, -25], [-53, -34], [-57, -38], [-62, -40], [-65, -45],
   [-68, -50], [-70, -54], [-74, -52], [-73, -44], [-72, -37], [-71, -30], [-70, -22],
   [-71, -16], [-76, -14], [-79, -7], [-81, -4]],

  /* ---------------------------------------------------------------- */
  /* Greenland and Iceland                                             */
  /* ---------------------------------------------------------------- */
  [[-45, 83], [-32, 82], [-22, 76], [-24, 71], [-32, 68], [-42, 61], [-49, 61],
   [-53, 66], [-56, 71], [-60, 76], [-55, 81]],
  [[-24, 66], [-18, 66], [-14, 65], [-19, 63], [-23, 64]],

  /* ---------------------------------------------------------------- */
  /* Africa                                                            */
  /* ---------------------------------------------------------------- */

  /* The north coast and the Sahara. */
  /*
    !! THE NORTH COAST STOPS AT 33, NOT 37 !!

    It ran to 37 and Europe's southern edge also sat at 36, so the
    Mediterranean was a single row of cells wide and the raster closed it.
    Africa and Europe rendered as one continent. Four degrees of sea is the
    minimum that survives a two degree grid.
  */
  [[-17, 21], [-13, 26], [-9, 30], [-5, 33], [2, 33], [9, 33], [11, 32],
   [16, 30], [22, 30], [28, 30], [32, 30], [34, 28], [36, 22], [37, 18],
   [34, 13], [24, 14], [15, 13], [5, 14], [-6, 15], [-16, 16]],
  /* West Africa and the Gulf of Guinea. */
  [[-17, 15], [-13, 12], [-8, 5], [-3, 5], [3, 6], [9, 4], [10, 2],
   [13, 2], [16, 8], [16, 14], [8, 14], [-2, 15], [-12, 16]],
  /* Central and southern Africa. */
  [[10, 2], [13, -5], [12, -11], [14, -18], [17, -23], [18, -29], [20, -34],
   [26, -34], [31, -30], [33, -26], [35, -22], [40, -16], [40, -10], [39, -6],
   [42, -2], [43, 4], [38, 4], [32, 4], [24, 5], [16, 6], [13, 2]],
  /* The horn. */
  [[42, -2], [46, 2], [51, 6], [51, 11], [48, 12], [43, 12], [39, 15],
   [36, 15], [37, 10], [40, 5]],
  /* Madagascar. */
  [[44, -12], [50, -15], [50, -20], [47, -25], [44, -22], [43, -17]],

  /* ---------------------------------------------------------------- */
  /* Europe                                                            */
  /* ---------------------------------------------------------------- */

  /* Iberia and France. */
  [[-9, 43], [-9, 37], [-6, 36], [-2, 37], [0, 39], [3, 42], [7, 43],
   [4, 46], [0, 47], [-2, 48], [-5, 48], [-2, 44]],
  /* Italy, the Balkans and Greece. */
  [[7, 45], [13, 46], [18, 45], [20, 42], [24, 41], [27, 41], [24, 38],
   [21, 39], [19, 40], [16, 39], [18, 41], [14, 41], [12, 44], [9, 44]],
  /* The Low Countries through Poland to the Baltic. */
  [[3, 51], [8, 54], [13, 54], [19, 55], [24, 57], [28, 59], [30, 60],
   [26, 61], [22, 60], [18, 58], [12, 56], [8, 57], [4, 53]],
  /* Scandinavia. */
  [[5, 58], [8, 63], [13, 65], [18, 69], [24, 71], [28, 70], [27, 66],
   [22, 63], [18, 60], [13, 58], [11, 59], [8, 58]],
  /* The British Isles, kept apart so the Channel survives the raster. */
  [[-5, 58], [-3, 58], [-1, 54], [1, 52], [-4, 50], [-5, 53]],
  [[-10, 55], [-6, 55], [-6, 52], [-10, 52]],
  /* European Russia and the Urals. */
  [[28, 60], [35, 64], [40, 66], [45, 66], [50, 68], [55, 68], [60, 66],
   [58, 58], [55, 52], [48, 48], [40, 45], [35, 45], [30, 46], [30, 52],
   [28, 56]],

  /* ---------------------------------------------------------------- */
  /* Asia                                                              */
  /* ---------------------------------------------------------------- */

  /* Anatolia and the Levant. */
  [[26, 40], [32, 41], [38, 41], [44, 40], [45, 37], [40, 36], [36, 36],
   [36, 31], [34, 30], [33, 34], [29, 36], [27, 37]],
  /* Arabia. */
  [[34, 29], [38, 30], [42, 30], [48, 29], [50, 26], [55, 25], [58, 23],
   [56, 19], [52, 16], [48, 14], [43, 13], [39, 17], [36, 22], [34, 26]],
  /* Iran, Afghanistan and Pakistan. */
  [[45, 39], [52, 40], [58, 38], [63, 37], [68, 37], [72, 36], [70, 30],
   [67, 25], [61, 25], [57, 26], [52, 27], [48, 30], [45, 33]],
  /* India, the peninsula that has to read. */
  [[68, 24], [72, 24], [76, 30], [80, 29], [85, 27], [89, 26], [92, 24],
   [90, 21], [87, 20], [85, 19], [83, 17], [81, 15], [80, 12], [78, 9],
   [76, 8], [74, 12], [73, 16], [72, 20], [70, 22]],
  /* Central Asia. */
  [[50, 45], [58, 47], [66, 49], [74, 50], [80, 50], [87, 49], [87, 43],
   [80, 42], [72, 40], [64, 41], [56, 43]],
  /*
    West Siberia, which was a hole in the map.

    The Siberian ring began at 66 north and Central Asia stopped at 50, so
    everything between them, the whole of the West Siberian Plain, rendered as
    ocean. It showed as a bay the size of India punched into the middle of
    Russia.
  */
  [[60, 50], [70, 51], [80, 52], [88, 52], [95, 54], [95, 66], [88, 68],
   [80, 68], [70, 67], [62, 66], [58, 62], [56, 56]],
  /* Siberia's north coast, with the capes that make it not a straight line. */
  [[60, 66], [66, 70], [69, 73], [73, 71], [78, 72], [83, 74], [90, 76],
   [95, 78], [100, 77], [106, 78], [113, 76], [118, 74], [126, 74], [133, 73],
   [140, 74], [148, 71], [156, 71], [162, 69], [170, 70], [180, 68], [180, 64],
   [172, 62], [164, 60], [158, 58], [152, 59], [146, 57], [140, 55], [132, 52],
   [126, 52], [120, 53], [112, 54], [104, 54], [96, 54], [88, 54], [80, 55],
   [72, 57], [66, 60], [62, 63]],
  /* China and Mongolia. */
  [[87, 49], [95, 50], [104, 50], [112, 50], [120, 50], [126, 46], [123, 41],
   [121, 38], [122, 33], [121, 30], [118, 25], [110, 21], [106, 21], [100, 22],
   [97, 28], [92, 28], [88, 31], [83, 35], [80, 40], [82, 45]],
  /* Korea and Japan. */
  [[126, 38], [129, 38], [129, 35], [126, 34], [125, 37]],
  [[130, 33], [136, 35], [140, 37], [141, 41], [141, 45], [145, 44], [142, 40],
   [137, 36], [132, 32]],
  /* Indochina. */
  [[97, 28], [100, 22], [106, 21], [109, 12], [105, 9], [103, 4], [100, 6],
   [98, 12], [96, 17], [94, 22]],
  /* The Malay archipelago, as separate islands. */
  [[96, 5], [101, 2], [105, -3], [106, -6], [101, -3], [95, 2]],
  [[105, -6], [114, -8], [115, -7], [106, -5]],
  [[109, 2], [117, 4], [119, -1], [116, -4], [110, -3], [108, 0]],
  [[119, -8], [125, -9], [131, -8], [125, -7], [120, -8]],
  [[118, 6], [122, 7], [126, 8], [124, 11], [121, 18], [119, 16], [120, 11]],
  /* New Guinea. */
  [[131, -1], [141, -3], [147, -8], [141, -9], [134, -8], [131, -4]],

  /* ---------------------------------------------------------------- */
  /* Oceania                                                           */
  /* ---------------------------------------------------------------- */
  [[114, -22], [113, -26], [115, -32], [119, -34], [126, -32], [131, -31], [135, -35],
   [138, -35], [141, -38], [147, -39], [150, -37], [153, -29], [153, -25], [149, -21],
   [146, -19], [143, -14], [142, -11], [137, -12], [132, -11], [129, -14], [125, -16],
   [122, -18], [117, -20]],
  [[145, -41], [148, -41], [148, -43], [145, -43]],
  [[173, -35], [178, -38], [177, -40], [174, -41], [171, -44], [167, -46], [170, -43],
   [173, -38]],
  /* Sri Lanka, because the hub is next door and its absence would show. */
  [[80, 9], [82, 8], [81, 6], [80, 7]],
];
