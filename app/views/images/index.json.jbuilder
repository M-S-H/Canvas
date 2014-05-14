json.array!(@images) do |image|
  json.extract! image, :id, :name, :s3_filename, :url
  json.url image_url(image, format: :json)
end
