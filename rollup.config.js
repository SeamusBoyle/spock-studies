import globalObj from './rollup-plugin-globalobj.js';
import glob from 'glob';

const globalObjHack = (io, map) => {
  return {
    input: io,
    output: {
      exports: 'none',
      file: map ? io.replace(map.from, map.to) : io
    },
    plugins: [globalObj()]
  };
};

const globalObjHacks = (ios, map) => {
  return glob.sync(ios).map(x => globalObjHack(x, map));
};

const hackysack = [];
hackysack.push(...globalObjHacks('build-es3/src/standard/**/*.js'));
hackysack.push(...globalObjHacks('build-es3/src/custom/**/*.js'));
export default hackysack;
