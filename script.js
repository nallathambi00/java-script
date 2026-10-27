const name= "ブレンダンアイク";
const birthyear= 1961;
const birthmonth= 7;
const birthday = 4;

const birthdate = `${birthyear}-${birthmonth}-${birthday}`

let age = null;
let isstudent = false;
let hobby = "プログラミング";
 
console.log(typeof name);
console.log(typeof birthyear);
console.log(typeof birthmonth);
console.log(typeof birthday);
console.log(typeof age);
console.log(age);

console.log(typeof isstudent);
console.log(typeof hobby);

age = 2026 - birthyear;

if (
    birthmonth > 10 || 
    (birthmonth === 10 && birthday > 27)
) {
    age--;
}
console.log(`年齢: ${age}歳`);  

let numerology = 0;
for (const num of birthdate.replace(/-/g, "")) {
    numerology += Number(num);
}

while (numerology > 9 && 
    numerology !== 22 && 
    numerology !== 33
) {
    numerology = Math.floor(numerology / 10) +
     (numerology % 10);
}

   

    const profile = document.getElementById("profile");
        profile.innerHTML = `
        <h2>プロフィール</h2>
        <p>名前: ${name}</p>    
        <p>生年月日: ${birthdate}</p>
        <p>年齢: ${age}歳</p>
        <p>趣味: ${hobby}</p>
        <p>数秘術:${numerology}</p>
        <a href="https://g-knowthyself.com/numero-${numerology}">診断結果を見る</a>
        `;
