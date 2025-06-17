// Калкулатор за броене на редове код по технологии
document.addEventListener('DOMContentLoaded', function() {
    let technologies = {};
    let total = 0;
    
    // Зареждане на данните от YAML файла
    async function loadTechnologiesData() {
        try {
            // Проверка дали YAML парсърът е зареден
            if (typeof jsyaml === 'undefined') {
                throw new Error('YAML parser не е зареден');
            }
            
            const response = await fetch('lines.yaml');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const yamlText = await response.text();
            const data = jsyaml.load(yamlText);
            technologies = data.technologies;
            
            // Изчисляване на общата сума
            total = Object.values(technologies).reduce((sum, value) => sum + value, 0);
            
            console.log('Данни за технологиите са заредени от lines.yaml:', technologies);
            console.log('Метаданни:', data.metadata);
            console.log('Общо редове:', total);
            
            // Обновяване на статистиките в HTML
            updateCodeStats();
            
        } catch (error) {
            console.error('Грешка при зареждане на lines.yaml:', error);
            
            // Fallback към hardcoded стойности
            technologies = {
                html: 0,
                css: 0,
                js: 0,
                xml: 0,
                sql: 0,
                toml: 0,
                json: 0,
                yaml: 0
            };
            total = Object.values(technologies).reduce((sum, value) => sum + value, 0);
            
            console.log('Използват се fallback стойности:', technologies);
            updateCodeStats();
        }
    }
    
    // Функция за обновяване на стойностите в HTML
    function updateCodeStats() {
        // Обновяване на HTML
        const htmlElement = document.querySelector('[data-tech="html"] span');
        if (htmlElement) {
            htmlElement.innerHTML = `<strong>HTML</strong> кодът е ${technologies.html.toLocaleString()} реда`;
        }
        
        // Обновяване на CSS
        const cssElement = document.querySelector('[data-tech="css"] span');
        if (cssElement) {
            cssElement.innerHTML = `<strong>CSS</strong> кодът е ${technologies.css.toLocaleString()} реда`;
        }
        
        // Обновяване на JS
        const jsElement = document.querySelector('[data-tech="js"] span');
        if (jsElement) {
            jsElement.innerHTML = `<strong>JS</strong> кодът е ${technologies.js.toLocaleString()} реда`;
        }
        
        // Обновяване на XML
        const xmlElement = document.querySelector('[data-tech="xml"] span');
        if (xmlElement) {
            xmlElement.innerHTML = `<strong>XML</strong> кодът е ${technologies.xml.toLocaleString()} реда`;
        }
        
        // Обновяване на SQL
        const sqlElement = document.querySelector('[data-tech="sql"] span');
        if (sqlElement) {
            sqlElement.innerHTML = `<strong>SQL</strong> кодът е ${technologies.sql.toLocaleString()} реда`;
        }
        
        // Обновяване на TOML
        const tomlElement = document.querySelector('[data-tech="toml"] span');
        if (tomlElement) {
            tomlElement.innerHTML = `<strong>TOML</strong> кодът е ${technologies.toml.toLocaleString()} реда`;
        }
        
        // Обновяване на JSON
        const jsonElement = document.querySelector('[data-tech="json"] span');
        if (jsonElement) {
            jsonElement.innerHTML = `<strong>JSON</strong> кодът е ${technologies.json.toLocaleString()} реда`;
        }
        
        // Обновяване на YAML
        const yamlElement = document.querySelector('[data-tech="yaml"] span');
        if (yamlElement) {
            yamlElement.innerHTML = `<strong>YAML</strong> кодът е ${technologies.yaml.toLocaleString()} реда`;
        }
        
        // Обновяване на общата сума
        const totalElement = document.querySelector('[data-tech="total"] span');
        if (totalElement) {
            totalElement.innerHTML = `<strong>ОБЩО</strong> кодът е ${total.toLocaleString()} реда`;
        }
    }
    
    // Функция за обновяване на стойности (за админ панел)
    window.updateTechnologyStats = function(newStats) {
        Object.assign(technologies, newStats);
        total = Object.values(technologies).reduce((sum, value) => sum + value, 0);
        updateCodeStats();
        console.log('Статистиките са обновени:', technologies, 'Общо:', total);
    };
    
    // Функция за запазване на данните в YAML файла (за бъдещо разширение)
    window.saveTechnologyStats = async function() {
        const dataToSave = {
            technologies: technologies,
            metadata: {
                lastUpdated: new Date().toISOString().split('T')[0],
                measuredWith: "Line Counter",
                toolUrl: "https://linecountr.vercel.app",
                description: "Автоматично броене на редовете код в проекта"
            }
        };
        
        // Генериране на YAML формат
        if (typeof jsyaml !== 'undefined') {
            const yamlOutput = jsyaml.dump(dataToSave, {
                indent: 2,
                lineWidth: 80,
                noRefs: true
            });
            console.log('YAML данни за запазване в lines.yaml:');
            console.log(yamlOutput);
            alert('За запазване в lines.yaml файла, моля копирайте YAML данните от конзолата.');
        } else {
            console.log('JSON данни за запазване:', dataToSave);
            alert('YAML parser не е наличен. Моля копирайте JSON данните от конзолата.');
        }
        
        return dataToSave;
    };
    
    // Публични функции за достъп до данните
    window.getTechnologyStats = function() {
        return { ...technologies, total };
    };
    
    // Инициализация - зареждане на данните
    loadTechnologiesData();
}); 