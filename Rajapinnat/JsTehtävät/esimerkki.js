const bookData=[
    {'name' :"C++", 'author' :"Jim Smith"},
    {'name' :"Java", 'author' :"Lisa Jones"},
    {'name' :"MySQL", 'author' :"Bob Danieles"}
];
console.log("Kirjailijan nimi on " +bookData[1].author+" ja kirjan nimi on " +bookData[1].name);
bookData.forEach(book => {console.log(book.author);});

for (let i = 0; i < bookData.length; i++) {
    console.log(bookData[i].author);
}