import type { Core } from '@strapi/strapi';

const allowedMediaTypes = [
  'image/*',
  'video/*',
  'audio/*',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.*',
  'text/plain',
  'text/csv',
];

const deniedExecutableTypes = [
  'application/vnd.microsoft.portable-executable',
  'application/x-msdownload',
  'application/x-msdos-program',
  'application/x-executable',
  'application/x-dosexec',
  'application/x-sh',
  'text/x-shellscript',
  'application/x-mach-binary',
];

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => {
  /*
   * !! LOCAL DISK IS THE DEFAULT, AND THAT IS ONLY SAFE FOR A LAPTOP !!
   *
   * cms/README.md's Deploying section names uploaded media as one of two
   * things blocking a real launch: the default provider writes to local
   * disk, which does not survive a container restart on Dokploy or most
   * other hosts. `SPACES_BUCKET` set switches to S3-compatible storage
   * (built and tested against DigitalOcean Spaces, which speaks the same
   * API); unset keeps the local provider Strapi ships with, which is
   * exactly right for a developer running this without a Spaces bucket to
   * point at.
   */
  const spacesBucket = env('SPACES_BUCKET');

  return {
    'users-permissions': {
      config: {
        jwtManagement: 'refresh',
        sessions: {
          httpOnly: true,
        },
      },
    },
    upload: {
      config: {
        security: {
          allowedTypes: allowedMediaTypes,
          deniedTypes: deniedExecutableTypes,
        },
        ...(spacesBucket
          ? {
              provider: 'aws-s3',
              providerOptions: {
                s3Options: {
                  credentials: {
                    accessKeyId: env('SPACES_ACCESS_KEY'),
                    secretAccessKey: env('SPACES_SECRET_KEY'),
                  },
                  /*
                   * A Spaces region, not an AWS one: nyc3, ams3, sgp1, fra1
                   * or sfo3. Match the droplet's own region where a Spaces
                   * region exists for it, so uploads do not cross a
                   * continent on every request. The droplet this was set up
                   * against is nyc1, and Spaces has no nyc1, so nyc3 is the
                   * nearest.
                   */
                  region: env('SPACES_REGION', 'nyc3'),
                  /*
                   * The bare regional endpoint, not the bucket's own
                   * subdomain - https://nyc3.digitaloceanspaces.com, never
                   * https://<bucket>.nyc3.digitaloceanspaces.com. The SDK
                   * builds the bucket subdomain itself from `params.Bucket`
                   * below; handing it a URL that already carries the bucket
                   * name is a documented source of Strapi/Spaces upload
                   * failures.
                   */
                  endpoint: env(
                    'SPACES_ENDPOINT',
                    `https://${env('SPACES_REGION', 'nyc3')}.digitaloceanspaces.com`
                  ),
                  /*
                   * false is virtual-hosted style (bucket.endpoint/key),
                   * which is what Spaces documents. Left as a var rather
                   * than a hardcoded false only because path style is the
                   * one thing that differs across S3-compatible providers,
                   * so a future provider swap should not need a code change
                   * to flip it.
                   */
                  forcePathStyle: env.bool('SPACES_FORCE_PATH_STYLE', false),
                  params: {
                    Bucket: spacesBucket,
                    ACL: 'public-read',
                  },
                },
              },
            }
          : {}),
      },
    },
  };
};

export default config;
