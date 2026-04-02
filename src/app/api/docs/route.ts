import { NextRequest, NextResponse } from 'next/server';

// Swagger/OpenAPI documentation for Resume Analyzer APIs
const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Resume Analyzer API Documentation',
    version: '1.0.0',
    description: 'API documentation for Resume Analyzer application including resume analysis, job search, and user management endpoints',
    contact: {
      name: 'API Support',
      email: 'support@resumanalyzer.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:8001/api',
      description: 'Development server on port 8001'
    },
    {
      url: 'http://localhost:3000/api',
      description: 'Development server on port 3000'
    }
  ],
  paths: {
    '/': {
      get: {
        summary: 'Home Page',
        description: 'Main application home page with resume upload interface',
        tags: ['Application'],
        responses: {
          200: {
            description: 'Home page loaded successfully',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                  example: '<!DOCTYPE html><html>...</html>'
                }
              }
            }
          }
        }
      }
    },
    '/jobs': {
      get: {
        summary: 'Jobs Page',
        description: 'Job search and recommendations page with filtered job listings',
        tags: ['Application'],
        responses: {
          200: {
            description: 'Jobs page loaded successfully',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                  example: '<!DOCTYPE html><html>...</html>'
                }
              }
            }
          }
        }
      }
    },
    '/login': {
      post: {
        summary: 'User Login',
        description: 'Authenticate user and return JWT token for session management',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    description: 'User email address',
                    example: 'user@example.com'
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    description: 'User password',
                    example: 'password123'
                  }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    token: {
                      type: 'string',
                      description: 'JWT authentication token',
                      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                    },
                    user: {
                      type: 'object',
                      properties: {
                        id: {
                          type: 'string',
                          example: 'user123'
                        },
                        email: {
                          type: 'string',
                          example: 'user@example.com'
                        },
                        name: {
                          type: 'string',
                          example: 'John Doe'
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Invalid credentials'
          },
          400: {
            description: 'Bad request - Missing email or password'
          }
        }
      }
    },
    '/upload': {
      post: {
        summary: 'Upload Resume',
        description: 'Upload resume file for analysis and job matching',
        tags: ['Resume Management'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  resume: {
                    type: 'string',
                    format: 'binary',
                    description: 'Resume file (PDF, DOC, DOCX, TXT)'
                  },
                  userId: {
                    type: 'string',
                    description: 'User ID for file association',
                    example: 'user123'
                  }
                },
                required: ['resume']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Resume uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    fileId: {
                      type: 'string',
                      description: 'Unique file identifier',
                      example: 'file_abc123'
                    },
                    fileName: {
                      type: 'string',
                      description: 'Original file name',
                      example: 'resume.pdf'
                    },
                    fileSize: {
                      type: 'integer',
                      description: 'File size in bytes',
                      example: 1024000
                    },
                    extractedText: {
                      type: 'string',
                      description: 'Extracted text from resume',
                      example: 'John Doe\nSoftware Developer with 5 years experience...'
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid file format or missing file'
          },
          500: {
            description: 'Upload failed'
          }
        }
      }
    },
    '/match': {
      post: {
        summary: 'Job Matching',
        description: 'Match uploaded resume with available jobs and calculate compatibility scores',
        tags: ['Job Matching'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  resumeText: {
                    type: 'string',
                    description: 'Resume text content for matching',
                    example: 'John Doe\nSoftware Developer with 5 years experience in React, Node.js, and MongoDB...'
                  },
                  skills: {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    description: 'Extracted skills from resume',
                    example: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript']
                  },
                  experience: {
                    type: 'string',
                    description: 'Experience level',
                    example: '5+ years'
                  },
                  location: {
                    type: 'string',
                    description: 'Preferred job location',
                    example: 'San Francisco, CA'
                  }
                },
                required: ['resumeText', 'skills']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Job matching completed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    matches: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/JobMatch'
                      }
                    },
                    totalMatches: {
                      type: 'integer',
                      example: 25
                    },
                    topMatch: {
                      $ref: '#/components/schemas/JobMatch'
                    },
                    averageMatchScore: {
                      type: 'number',
                      example: 78.5
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Missing resume text or skills'
          },
          500: {
            description: 'Matching failed'
          }
        }
      }
    },
    '/analyze': {
      post: {
        summary: 'Analyze Resume',
        description: 'Upload and analyze a resume to extract skills, experience, and provide job recommendations',
        tags: ['Resume Analysis'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  resume: {
                    type: 'string',
                    format: 'binary',
                    description: 'Resume file (PDF, DOC, DOCX)'
                  }
                },
                required: ['resume']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Resume analysis completed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true
                    },
                    analysis: {
                      type: 'object',
                      properties: {
                        skills: {
                          type: 'array',
                          items: {
                            type: 'string'
                          },
                          example: ['React', 'TypeScript', 'Node.js', 'MongoDB']
                        },
                        experience: {
                          type: 'string',
                          example: '5+ years'
                        },
                        education: {
                          type: 'string',
                          example: 'Bachelor of Science in Computer Science'
                        },
                        score: {
                          type: 'number',
                          example: 85
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Invalid file format or missing resume'
          },
          500: {
            description: 'Internal server error'
          }
        }
      }
    },
    '/proxy/linkedin-jobs': {
      get: {
        summary: 'Search LinkedIn Jobs',
        description: 'Search for jobs using LinkedIn-style job API with real job postings from GitHub and realistic fallback data',
        tags: ['Job Search'],
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            description: 'Search query (skills, job title, or keywords)',
            schema: {
              type: 'string',
              example: 'React Developer'
            }
          },
          {
            name: 'location',
            in: 'query',
            required: false,
            description: 'Job location preference',
            schema: {
              type: 'string',
              example: 'San Francisco'
            }
          }
        ],
        responses: {
          200: {
            description: 'Job search results from GitHub API or realistic fallback data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    jobs: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Job'
                      }
                    },
                    total: {
                      type: 'integer',
                      example: 25
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Bad request - Missing query parameter'
          },
          500: {
            description: 'API error - Unable to fetch job data'
          }
        }
      }
    },
    '/proxy/naukri-jobs': {
      get: {
        summary: 'Search Naukri Jobs',
        description: 'Search for jobs using Naukri-style job API with Indian job market focus',
        tags: ['Job Search'],
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            description: 'Search query (skills, job title, or keywords)',
            schema: {
              type: 'string',
              example: 'Frontend Developer'
            }
          }
        ],
        responses: {
          200: {
            description: 'Naukri job search results',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    jobs: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Job'
                      }
                    },
                    total: {
                      type: 'integer',
                      example: 15
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/proxy/instahyre-jobs': {
      get: {
        summary: 'Search Instahyre Jobs',
        description: 'Search for jobs using Instahyre-style job API with startup focus',
        tags: ['Job Search'],
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            description: 'Search query (skills, job title, or keywords)',
            schema: {
              type: 'string',
              example: 'Full Stack Developer'
            }
          }
        ],
        responses: {
          200: {
            description: 'Instahyre job search results',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    jobs: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Job'
                      }
                    },
                    total: {
                      type: 'integer',
                      example: 20
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/proxy/wellfound-jobs': {
      get: {
        summary: 'Search Wellfound Jobs',
        description: 'Search for jobs using Wellfound-style job API with startup and tech focus',
        tags: ['Job Search'],
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            description: 'Search query (skills, job title, or keywords)',
            schema: {
              type: 'string',
              example: 'Software Engineer'
            }
          }
        ],
        responses: {
          200: {
            description: 'Wellfound job search results',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    jobs: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Job'
                      }
                    },
                    total: {
                      type: 'integer',
                      example: 18
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/docs': {
      get: {
        summary: 'API Documentation',
        description: 'Interactive Swagger UI documentation for all Resume Analyzer APIs',
        tags: ['Documentation'],
        responses: {
          200: {
            description: 'Swagger UI documentation page',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                  example: '<!DOCTYPE html><html>...</html>'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Job: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique job identifier',
            example: 'linkedin-12345'
          },
          title: {
            type: 'string',
            description: 'Job title',
            example: 'Senior Frontend Developer'
          },
          company: {
            type: 'string',
            description: 'Company name',
            example: 'Tech Corp'
          },
          location: {
            type: 'string',
            description: 'Job location',
            example: 'San Francisco, CA'
          },
          description: {
            type: 'string',
            description: 'Job description and requirements',
            example: 'We are looking for an experienced Frontend Developer with React and TypeScript skills...'
          },
          platform: {
            type: 'string',
            enum: ['linkedin', 'naukri', 'instahyre', 'wellfound', 'jobicy', 'remoteok'],
            description: 'Source platform where job was found'
          },
          url: {
            type: 'string',
            format: 'uri',
            description: 'Direct URL to job application',
            example: 'https://linkedin.com/jobs/view/senior-frontend-developer'
          },
          postedDate: {
            type: 'string',
            description: 'When job was posted',
            example: '2 days ago'
          },
          salary: {
            type: 'string',
            description: 'Salary range',
            example: '$120k - $160k'
          },
          experience: {
            type: 'string',
            description: 'Required experience level',
            example: '5+ years'
          },
          skills: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Required skills for the job',
            example: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML']
          },
          matchScore: {
            type: 'number',
            description: 'Match score based on resume skills (0-100)',
            example: 85
          }
        },
        required: ['id', 'title', 'company', 'location', 'description', 'platform', 'url']
      },
      JobMatch: {
        type: 'object',
        properties: {
          job: {
            $ref: '#/components/schemas/Job'
          },
          matchScore: {
            type: 'number',
            description: 'Compatibility score between resume and job (0-100)',
            example: 85
          },
          matchedSkills: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Skills from resume that match job requirements',
            example: ['React', 'TypeScript', 'JavaScript']
          },
          missingSkills: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Skills required by job but not found in resume',
            example: ['GraphQL', 'Docker']
          },
          experienceMatch: {
            type: 'boolean',
            description: 'Whether experience level matches requirements',
            example: true
          },
          locationMatch: {
            type: 'boolean',
            description: 'Whether location preference matches job location',
            example: true
          },
          recommendation: {
            type: 'string',
            description: 'Recommendation based on match analysis',
            example: 'Strong match - Apply immediately'
          }
        },
        required: ['job', 'matchScore', 'matchedSkills']
      }
    }
  },
  tags: [
    {
      name: 'Application',
      description: 'Main application pages and UI endpoints'
    },
    {
      name: 'Authentication',
      description: 'User authentication and session management'
    },
    {
      name: 'Resume Management',
      description: 'Resume upload, storage, and file management'
    },
    {
      name: 'Resume Analysis',
      description: 'Resume upload and analysis endpoints'
    },
    {
      name: 'Job Matching',
      description: 'Resume-job compatibility matching algorithms'
    },
    {
      name: 'Job Search',
      description: 'Job search and recommendation endpoints'
    },
    {
      name: 'Documentation',
      description: 'API documentation and Swagger UI'
    }
  ]
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');

  // Return JSON format for API consumers
  if (format === 'json') {
    return NextResponse.json(swaggerSpec);
  }

  // Return HTML Swagger UI for browser viewing
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Resume Analyzer API Documentation</title>
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui.css" />
      <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-bundle.js"></script>
      <script src="https://unpkg.com/swagger-ui-dist@3.52.5/swagger-ui-standalone-preset.js"></script>
      <script>
        window.onload = function() {
          const ui = SwaggerUIBundle({
            url: '/api/docs?format=json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            plugins: [
              SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: "StandaloneLayout"
          });
        }
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
