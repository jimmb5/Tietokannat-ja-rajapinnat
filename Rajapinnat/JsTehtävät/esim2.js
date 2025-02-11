const person={
    personData:[
        {'fn' :"Jim", 'ln' :"Smith"},
        {'fn' :"Lisa", 'ln' :"Smith"},
        {'fn' :"Ann", 'ln' :"Jones"},
    ],
    showData: function(){
        console.log(this.personData);
    },
    showOne: function(id){
        console.log(this.personData[id]);
    },
    insertData: function(addFn, addLn){
        this.personData.push({fn:addFn, ln:addLn});
    },
    showLast: function(){
        console.log(this.personData[this.personData.length-1]);
    },
};

person.insertData('Teppo','Testi');
person.showData();
console.log("\n");
person.showOne(1);
person.showLast();