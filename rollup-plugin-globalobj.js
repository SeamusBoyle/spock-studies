import { createFilter } from 'rollup-pluginutils';

export default function globalObj(options = {}) {
  const filter = createFilter(options.include, options.exclude);

  // assumes the first file is the indicator that needs the global obj hack applied
  let isIndicatorScript = true;

  return {
    transform(code, id) {
      if (!isIndicatorScript) return;
      isIndicatorScript = false;

      if (!filter(id)) return;

      // comment out default export, instantiate it in obj global
      // TODO(seamus): Only change last occurrence?
      // it's normally at the end of file, but
      // someone could have it in a comment
      const regex = /^(export default (?!obj[^\w])(\w+)[;]?)$/gm;
      // TODO(seamus): Remove call to noop noop function
      // it's a workaround so rollup doesn't generate an empty file
      const subst = 'var obj = new $2(); if (Math.noop !== undefined) Math.noop(obj !== undefined); // $1';
      let generatedCode = code.replace(regex, subst);

      // comment all other exports (starting in column 0)
      const removeRegex = /^(export )/gm;
      const commentOut = '// $1';
      generatedCode = generatedCode.replace(removeRegex, commentOut);
      return {
        code: generatedCode,
        map: { mappings: '' }
      };
    }
  };
}
