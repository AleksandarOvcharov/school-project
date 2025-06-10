// Chart configurations
const chartConfig = {
   responsive: true,
   maintainAspectRatio: true,
   plugins: {
       legend: {
           position: 'top',
       },
   }
};

// Age distribution chart
const ageCtx = document.getElementById('ageChart').getContext('2d');
new Chart(ageCtx, {
   type: 'bar',
   data: {
       labels: ['10-12 години', '13-15 години', '16-18 години', '19+ години'],
       datasets: [{
           label: 'Процент жертви (%)',
           data: [15, 45, 35, 25],
           backgroundColor: [
               '#007acc',
               '#005999',
               '#004d7a',
               '#00385c'
           ],
           borderColor: '#003d5c',
           borderWidth: 1
       }]
   },
   options: {
       ...chartConfig,
       scales: {
           y: {
               beginAtZero: true,
               max: 50
           }
       }
   }
});

// Platform chart
const platformCtx = document.getElementById('platformChart').getContext('2d');
new Chart(platformCtx, {
   type: 'doughnut',
   data: {
       labels: ['Instagram', 'TikTok', 'Facebook', 'WhatsApp', 'Discord', 'Snapchat', 'Други'],
       datasets: [{
           data: [25, 20, 18, 15, 10, 7, 5],
           backgroundColor: [
               '#E1306C',
               '#000000',
               '#1877F2',
               '#25D366',
               '#5865F2',
               '#FFFC00',
               '#007acc'
           ]
       }]
   },
   options: chartConfig
});

// Response chart
const responseCtx = document.getElementById('responseChart').getContext('2d');
new Chart(responseCtx, {
   type: 'pie',
   data: {
       labels: ['Споделят с родител', 'Споделят с приятел', 'Споделят с учител', 'Не споделят никъде', 'Докладват в платформата'],
       datasets: [{
           data: [25, 30, 15, 25, 5],
           backgroundColor: [
               '#007acc',
               '#28a745',
               '#ffc107',
               '#dc3545',
               '#6c757d'
           ]
       }]
   },
   options: chartConfig
});