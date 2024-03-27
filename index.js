const axios = require('axios');

exports.handler = async (event) => {
  const json = JSON.parse(event.body);

  const payload = {
    text: `Issue Created: ${json.issue.html_url}`,
  };

  const slackUrl = process.env.SLACK_URL;

  try {
    const response = await axios.post(slackUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error("Error posting to Slack: ", error);
    return {
      statusCode: error.response.status,
      body: JSON.stringify(error.message),
    };
  }
};
