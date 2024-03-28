const axios = require('axios');

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    let json;
    try {
        if (typeof event.body === 'string') {
            json = JSON.parse(event.body);
        } else {
            json = event.body || event;
        }
    } catch (error) {
        console.error('Error parsing event:', error);
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Could not parse event body as JSON' }),
        };
    }

    const message = json.issue ? `Issue Created: ${json.issue.html_url}` : 'No issue URL found';
    const payload = { text: message };

    try {
        const response = await axios.post(process.env.SLACK_URL, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Message posted to Slack:', response.data);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Success', response: response.data }),
        };
    } catch (error) {
        console.error('Error posting to Slack:', error.toString());
        return {
            statusCode: error.response ? error.response.status : 500,
            body: JSON.stringify({ message: 'Failed to post message to Slack', error: error.toString() }),
        };
    }
};
