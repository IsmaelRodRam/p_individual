var options2 = function(){
    const default_options2 = {
        nivel:1,
        difficulty:'normal'
    };
    
    var nivel = $('#nivel');
    var difficulty = $('#dif');

    var options2 = JSON.parse(localStorage.options2||JSON.stringify(default_options2));
    nivel.val(options2.nivel);
    difficulty.val(options2.difficulty);
    nivel.on('change',()=>options2.nivel = nivel.val());
    difficulty.on('change',()=>options2.difficulty = difficulty.val());

    return { 
        applyChanges: function(){
            localStorage.options2 = JSON.stringify(options2);
        },
        defaultValues: function(){
            options2.nivel = default_options2.nivel;
            options2.difficulty = default_options2.difficulty;
            pairs.val(options2.nivel);
            difficulty.val(options2.difficulty);
        }
    }
}();

$('#default').on('click',function(){
    options2.defaultValues();
});

$('#apply').on('click',function(){
    options2.applyChanges();
    location.assign("../");
});