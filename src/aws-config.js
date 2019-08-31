// Manual configuration (i.e. skipping the amplify cli assumptions) for AWS Services
const awsmobile = {
    dev: {
        "aws_cognito_region": "us-east-2",
        "aws_user_pools_id": "us-east-2_QPz9qLkQL",
        "aws_user_pools_web_client_id": "3qkoupgav6gbvs4cbebphqbdlq",
        "aws_content_delivery_bucket": "pntp-gp-ui-20190219082147-hostingbucket-dev",
        "aws_content_delivery_bucket_region": "us-east-2",
        "aws_content_delivery_url": "http://pntp-gp-ui-20190219082147-hostingbucket-dev.s3-website.us-east-2.amazonaws.com"
    }
}

export default awsmobile