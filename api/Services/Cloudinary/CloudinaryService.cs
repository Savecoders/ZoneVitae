using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DotNetEnv;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Diagnostics;

namespace api.Services.Cloudinary
{
  public class CloudinaryService
  {
    private readonly CloudinaryDotNet.Cloudinary? _cloudinary;
    private bool IsConfigured { get; set; }

    public CloudinaryService(IConfiguration configuration)
    {
      // Get Cloudinary credentials from environment variables
      var cloudName = Env.GetString("CLOUDINARY_CLOUD_NAME");
      var apiKey = Env.GetString("CLOUDINARY_API_KEY");
      var apiSecret = Env.GetString("CLOUDINARY_API_SECRET");

      // Check if all required configuration values are present
      if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
      {
        IsConfigured = false;
        return;
      }

      // Create Cloudinary instance
      var account = new Account(cloudName, apiKey, apiSecret);
      _cloudinary = new CloudinaryDotNet.Cloudinary(account);
      IsConfigured = true;
    }

    public async Task<ImageUploadResult?> UploadImageAsync(string filePath)
    {
      if (!IsConfigured || _cloudinary == null)
      {
        Console.WriteLine("Cloudinary not configured - cannot upload image");
        return null;
      }

      var uploadParams = new ImageUploadParams()
      {
        File = new FileDescription(filePath)
      };
      return await _cloudinary.UploadAsync(uploadParams);
    }

    public async Task<ImageUploadResult?> UploadImageAsync(IFormFile file)
    {
      if (!IsConfigured || _cloudinary == null)
      {
        Console.WriteLine("Cloudinary not configured - cannot upload image");
        return null;
      }

      using var stream = file.OpenReadStream();
      var uploadParams = new ImageUploadParams()
      {
        File = new FileDescription(file.FileName, stream)
      };
      return await _cloudinary.UploadAsync(uploadParams);
    }
  }
}