export function random(len: number) {
  let options = "qweryuiop1234567890-";
  let length = options.length;
  let ans = "";
  for (let i = 0; i < len; i++) {
    ans += options[Math.random() * length];

    return ans;
  }
}
