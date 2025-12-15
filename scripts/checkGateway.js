import fetch from 'node-fetch';

async function check() {
    try {
        console.log("Checking gateway...");
        const response = await fetch("https://relayer.testnet.zama.cloud/keyurl");
        console.log("Status:", response.status);
        const text = await response.text();
        console.log("Response:", text);
    } catch (e) {
        console.error("Error:", e);
    }
}
check();
