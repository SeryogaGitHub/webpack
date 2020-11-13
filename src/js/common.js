let add = (a, b) => a + b;
console.log(add(1,4));

async function start(){
  return await Promise.resolve('async is working')
}

start().then(console.log)

