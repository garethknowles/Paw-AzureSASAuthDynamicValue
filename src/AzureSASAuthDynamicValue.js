// import sha256 from 'crypto-js/sha256';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';


function calculateExpiryTimestamp(expiryInMins) {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + (expiryInMins * 60 * 1000));
    return Math.round(expiryDate.getTime() /  1000)
}

// Custom encodeURIComponent due to C# requiring lower-case escape encodings
function lowercaseEncodeURIComponent(stringToEscape) {

    const replacmentDict = {
        "/": "%2f",
        "+": "%2b",
        "@": "%40",
        "?": "%3f",
        "=": "%3d",
        ":": "%3a,",
        "#": "%23",
        ";": "%3b",
        ",": "%2c",
        "$": "%24",
        "&": "%26",
        " ": "%20",
        "%": "%25",
        "^": "%5e",
        "[": "%5b",
        "]": "%5d",
        "{": "%7b",
        "}": "%7d",
        "<": "%3c",
        "\"": "%22",
        ">": "%3e",
        "\\": "%5c",
        "|": "%7c",
        "\`": "%60"
    }

    const string = stringToEscape + ''
    const encodedString = string
        .split("")
        .map(function(x) {
            var replacment = replacmentDict[x]
            if (replacment != null) {
                return replacment
            } else {
                return x
            }
        })
        .join("")
    return encodedString
}

function generateSAS(resourceUri, keyName, signingKey, expiry) {

    const encodedUri = lowercaseEncodeURIComponent(resourceUri);
    const stringToSign = encodedUri + "\n" +  expiry;    
    const signature = Base64.stringify(hmacSHA256(stringToSign, signingKey));
    const encodedSig = lowercaseEncodeURIComponent(signature);

    const sas = "SharedAccessSignature sr=" + encodedUri + "&sig=" + encodedSig + "&se=" + expiry + "&skn=" + keyName;
    return sas
}

// See Azure Documentation: https://docs.microsoft.com/en-gb/azure/service-bus-messaging/service-bus-sas
var AzureSASAuthDynamicValue = function() {

    this.evaluate = function(context) {

        const resourceUri = this.resourceUri;
        const keyName = this.keyName;
        const signingKey = this.key;
        const expiry = calculateExpiryTimestamp(60);

        return generateSAS(resourceUri, keyName, signingKey, expiry);
    }
}

AzureSASAuthDynamicValue.identifier = 'uk.co.garethknowles.PawExtensions.AzureSASAuthDynamicValue'
AzureSASAuthDynamicValue.title = 'Azure Shared Access Signature Auth'
AzureSASAuthDynamicValue.help = 'https://github.com/garethknowles/Paw-AzureSASAuthDynamicValue'
AzureSASAuthDynamicValue.inputs = [
      DynamicValueInput('resourceUri', 'Resource URI', 'String'),
      DynamicValueInput('keyName', 'Azure SharedAccessKeyName', 'String'),
      DynamicValueInput('key', 'Azure SharedAccessKey', 'SecureValue'),
  ];
registerDynamicValueClass(AzureSASAuthDynamicValue)
