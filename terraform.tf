# Variables that need to exist in a different file
variable "ACCESS_KEY" {}
variable "SECRET_KEY" {}
variable "ALEXA_APP_ID" {}
variable "DEVICE_URI" {}
variable "DEVICE_API_VERSION" {}
variable "VERBOSE" {}
variable "REGION" {
  default = "us-east-1"
}
variable "APP_NAME" {
  default = "alexa-pi-player"
}
variable "LAMBDA_ZIP_NAME" {
  default = "tmp/function.zip"
}
provider "aws" {
  access_key = "${var.ACCESS_KEY}"
  secret_key = "${var.SECRET_KEY}"
  region     = "${var.REGION}"
}

# Zip up Lambda function
data "archive_file" "lambda_zip" {
    type        = "zip"
    source_dir  = "lambda"
    output_path = "${var.LAMBDA_ZIP_NAME}"
}

# Role for Lambda function
resource "aws_iam_role" "alexa_pi_player_lambda_role" {
  name               = "${var.APP_NAME}-lambda-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "",
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

# IAM Policy for Lambda function
resource "aws_iam_role_policy" "alexa_pi_player_lambda_role_policy" {
    name   = "${var.APP_NAME}-lambda-role-policy"
    role   = "${aws_iam_role.alexa_pi_player_lambda_role.id}"
    policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Effect": "Allow",
          "Action": [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents"
          ],
          "Resource": "*"
      }
  ]
}
EOF
}

# Lambda function
resource "aws_lambda_function" "alexa_pi_player_lambda" {
  filename         = "${var.LAMBDA_ZIP_NAME}"
  source_code_hash = "${data.archive_file.lambda_zip.output_base64sha256}"
  description      = "Lambda Function handles Alexa Pi Plaxer intents."
  function_name    = "${var.APP_NAME}-lambda"
  role             = "${aws_iam_role.alexa_pi_player_lambda_role.arn}"
  handler          = "index.handler"
  runtime          = "nodejs6.10"
  timeout          = "10"
  environment {
    variables = {
      ALEXA_APP_ID = "${var.ALEXA_APP_ID}"
      DEVICE_URI = "${var.DEVICE_URI}"
      DEVICE_API_VERSION = "${var.DEVICE_API_VERSION}"
      VERBOSE = "${var.VERBOSE}"
    }
  }
}

# Alias pointing to $LATEST for Lambda function
resource "aws_lambda_alias" "alexa_pi_player_lambda_alias" {
  name             = "Latest"
  function_name    = "${aws_lambda_function.alexa_pi_player_lambda.arn}"
  function_version = "$LATEST"
}

# Allow Alexa Skill Kit to invoke this lambda
resource "aws_lambda_permission" "alexa_pi_player_lambda_permission" {
  statement_id  = "AllowExecutionFromAlexa"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.alexa_pi_player_lambda.function_name}"
  principal     = "alexa-appkit.amazon.com"
}

# # Allow Cloudwatch to invoke Lambda function
# resource "aws_lambda_permission" "allow_cloudwatch" {
#   statement_id   = "AllowExecutionFromCloudWatch"
#   action         = "lambda:InvokeFunction"
#   function_name  = "${aws_lambda_function.alexa_pi_player_lambda.function_name}"
#   principal      = "events.amazonaws.com"
#   source_arn     = "${aws_cloudwatch_event_rule.scheduled_event.arn}"
#   qualifier      = "${aws_lambda_alias.alexa_pi_player_lambda_alias.name}"
# }

# # Create event rule
# resource "aws_cloudwatch_event_rule" "scheduled_event" {
#   name        = "${var.APP_NAME}-scheduled-event"
#   description = "Recurrent event for calling Lambda Function"
#   schedule_expression = "${var.SCHEDULE_EXPRESSION}"
# }

# # Map event rule to trigger lambda function
# resource "aws_cloudwatch_event_target" "lambda_trigger" {
#   rule      = "${aws_cloudwatch_event_rule.scheduled_event.name}"
#   arn       = "${aws_lambda_alias.alexa_pi_player_lambda_alias.arn}"
# }
