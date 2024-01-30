const url = window.location.href;
const domainName = new URL(url).hostname;



async function checkSSL(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.url.startsWith('https://');
  } catch (error) {
    console.error('Error checking SSL:', error);
    return false;
  }
}

async function getGoogleRanking(website, apiKey, cx) {
  try {
    const response = await fetch(`https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=site:${website}`);
    const data = await response.json();
    const ranking = data.items.findIndex(item => item.link === `https://${website}/`) + 1;
    return ranking;
  } catch (error) {
    console.error('Error fetching Google ranking:', error);
    return -1; // Return -1 if an error occurs
  }
}

const analyzePage = async function analyzePage() {
  const apiKey = 'AIzaSyCp9Hw2jSibMdnHedRQtCM6gb08zZx0Y0c'; // Replace with your actual API key
  const cx = 'd4f501cc71348432f'; // Replace with your actual custom search engine ID


  // Check SSL
  const validSSL = await checkSSL(url);

  // Get Google ranking
  const website = domainName; // Use domainName for ranking
  const ranking = await getGoogleRanking(website, apiKey, cx);

  // Prepare phishing data
  const phishingData = {
    domainName: domainName,
    valid: validSSL,
    urlLen: url.length,
    haveDash: url.includes('-'),
    domainLen: domainName.length,
    nosofsubdomain: domainName.split('.').length - 1,
    ranking: ranking,
  };

  // Send data to background script
  chrome.runtime.sendMessage({ action: 'analyzePage', data: phishingData });
};

// Call the analyzePage function
analyzePage();
