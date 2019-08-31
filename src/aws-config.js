// Manual configuration (i.e. skipping the amplify cli assumptions) for AWS Services
import { Auth } from 'aws-amplify'

const awsmobile = {
    dev: {
        "aws_cognito_region": "us-east-2",
        "aws_user_pools_id": "us-east-2_QPz9qLkQL",
        "aws_user_pools_web_client_id": "3qkoupgav6gbvs4cbebphqbdlq",
        "aws_content_delivery_bucket": "pntp-gp-ui-20190219082147-hostingbucket-dev",
        "aws_content_delivery_bucket_region": "us-east-2",
        "aws_content_delivery_url": "http://pntp-gp-ui-20190219082147-hostingbucket-dev.s3-website.us-east-2.amazonaws.com",

        endpoints: [
            {
                name: "GlobalProbeAPI",
                endpoint: "https://25zwa0yf5h.execute-api.us-east-2.amazonaws.com/dev/v1",
                custom_header: async () => {
                    return { Authorization: (await Auth.currentAuthenticatedUser()).signInUserSession.idToken.jwtToken }
                }
            },
        ]
    }
}

export default awsmobile