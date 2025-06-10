function toggleVideoDropdown() {
   const dropdown = document.getElementById('videoDropdown');
   const arrow = document.querySelector('.dropdown-arrow');
   
   if (dropdown.classList.contains('active')) {
       dropdown.classList.remove('active');
       arrow.style.transform = 'rotate(0deg)';
   } else {
       dropdown.classList.add('active');
       arrow.style.transform = 'rotate(180deg)';
   }
}