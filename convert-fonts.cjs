const Fontmin = require('fontmin');

const fonts = [
  'Chillax.ttf',
  'YatraOne-Regular.ttf',
  'ApfelGrotezk-Regular.otf',
  'BiggerDisplay.otf'
];

fonts.forEach(font => {
  new Fontmin()
    .src(`src/assets/fonts/${font}`)
    .use(Fontmin.ttf2woff2())
    .dest('src/assets/fonts/')
    .run();
});