require 'RMagick'
require 'aws/s3'
require 'zip'
require 'open-uri'

class VideoController < ApplicationController
	def webcam
	end

	def save_video
		name = "#{params[:vid]}/#{params[:frame]}.jpg"
		@end = params[:last]

		img = Magick::Image.read_inline(params[:image]).first
		AWS::S3::S3Object.store(name, img.to_blob, S3_CREDENTIALS[:bucket_name], :access => :public_read)

		archive_file = "#{Rails.root}/tmp/archive.zip"

		if @end == "true"
			#t = Tempfile.new("video")


			Zip::ZipOutputStream.open(archive_file) do |z|
				params[:frame].to_i.times do |n|
					z.put_next_entry("images/#{n+1}.jpg")
					filename = "https://s3.amazonaws.com/#{S3_CREDENTIALS[:bucket_name]}/#{params[:vid]}/#{n+1}.jpg"
					puts filename
					url1_data = open(filename)
					z.print IO.read(url1_data)
				end
			end
		end

		send_file archive_file
	end
end
