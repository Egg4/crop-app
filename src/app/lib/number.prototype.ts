interface NumberConstructor {
  random(scope?: number): number;
}

Number.random = function(scope?: number) {
  scope = scope || Number.MAX_SAFE_INTEGER;
  return Math.floor(Math.random() * scope);
};