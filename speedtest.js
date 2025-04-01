document.getElementById('startTest').addEventListener('click', startSpeedTest);

async function startSpeedTest() {
    const startBtn = document.getElementById('startTest');
    const progressDiv = document.querySelector('.progress');
    const progressBar = document.getElementById('progressBar');
    const resultDiv = document.getElementById('result');
    
    startBtn.disabled = true;
    startBtn.textContent = 'Testing...';
    progressDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    
    try {
        // Test ping first
        progressBar.style.width = '10%';
        const ping = await testPing();
        document.getElementById('ping').textContent = ping;
        
        // Test download speed
        progressBar.style.width = '40%';
        const downloadSpeed = await testDownloadSpeed();
        document.getElementById('downloadSpeed').textContent = downloadSpeed.toFixed(2);
        
        // Test upload speed
        progressBar.style.width = '70%';
        const uploadSpeed = await testUploadSpeed();
        document.getElementById('uploadSpeed').textContent = uploadSpeed.toFixed(2);
        
        progressBar.style.width = '100%';
        resultDiv.style.display = 'block';
    } catch (error) {
        alert('Speed test failed: ' + error.message);
    } finally {
        startBtn.disabled = false;
        startBtn.textContent = 'Start Speed Test';
    }
}

async function testPing() {
    const startTime = performance.now();
    const response = await fetch('https://httpbin.org/get', {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    const endTime = performance.now();
    
    if (!response.ok) {
        throw new Error('Ping test failed');
    }
    
    return (endTime - startTime).toFixed(2);
}

async function testDownloadSpeed() {
    const testDataUrl = 'https://httpbin.org/bytes/1000000'; // ~1MB file
    const startTime = performance.now();
    
    const response = await fetch(testDataUrl, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    const endTime = performance.now();
    
    if (!response.ok) {
        throw new Error('Download test failed');
    }
    
    const data = await response.blob();
    const duration = (endTime - startTime) / 1000; // in seconds
    const bitsLoaded = data.size * 8;
    const speedMbps = (bitsLoaded / duration / 1000000); // Mbps
    
    return speedMbps;
}

async function testUploadSpeed() {
    const testData = new Blob([new ArrayBuffer(1000000)]); // ~1MB data
    const startTime = performance.now();
    
    const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        cache: 'no-store',
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/octet-stream'
        },
        body: testData
    });
    const endTime = performance.now();
    
    if (!response.ok) {
        throw new Error('Upload test failed');
    }
    
    const duration = (endTime - startTime) / 1000; // in seconds
    const bitsLoaded = testData.size * 8;
    const speedMbps = (bitsLoaded / duration / 1000000); // Mbps
    
    return speedMbps;
}