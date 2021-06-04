/* 
This script will enable the slide and hide menu. 

- it will detect if the user clicks on the button class="btn-menu"
- each click will toggle ON and OFF the class="show", between these two states:
   <nav class="show">
    OR
   <nav>
- css style will take care of what to do with class="show"

*/


(function(d){
	
	// d = document
	
	const $nav = d.querySelector('nav');
	const $btn = d.querySelector('.btn-menu');
	
	$btn.addEventListener('click', function(){
		
		$nav.classList.toggle('show');
		
	});
	
	
})(document);