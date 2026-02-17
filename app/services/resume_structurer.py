import re 

COMMON_SKILLS = [
    "react",
    "python",
    "javascript",
    "java",
    "c++",
    "c#",
    "php",
    "ruby",
    "go",
    "rust",
    "swift",
    "kotlin",
    "scala",
    "r",
    "matlab",
    "sql",
    "nosql",
    "mongodb",
    "postgresql",
    "mysql",
    "oracle",
    "microsoft sql server",
    "redis",
    "elasticsearch",
    "cassandra",
    "couchbase",
    "neo4j",
    "influxdb",
    "prometheus",
    "grafana",
    "kafka",
    "rabbitmq",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "jenkins",
    "git",
    "github",
    "gitlab",
    "bitbucket",
    "terraform",
    "ansible",
    "chef",
    "puppet",
    "vagrant",
    "virtualbox",
    "vmware",
    "aws ec2",
    "aws s3",
    "aws lambda",
    "aws rds",
    "aws dynamodb",
    "aws sqs",
    "aws sns",
    "aws ssm",
    "aws cloudwatch",
    "aws iam",
    "aws vpc",
    "aws ec2 autoscaling",
    "aws elb",
    "aws api gateway",
    "aws lambda",
    "aws s3",
    "aws rds",
    "aws dynamodb",
    "aws sqs",
    "aws sns",
    "aws ssm",
    "aws cloudwatch",
    "aws iam",
    "aws vpc",
    "aws ec2 autoscaling",
    "aws elb",
    "aws api gateway",
]

def structure_resume(text:str) -> dict:
    lower_text = text.lower()

    skills = [skill for skill in COMMON_SKILLS if skill in lower_text]

    #extract name
    lines = text.split('\n')
    name = lines[0].strip() if lines else ""

    #extract role
    role = ""
    for line in lines:
        if "role" in line.lower():
            role = line.strip()
            break
    
    return {
        'skills': skills,
        'name': name,
        'role': role
    }
    
