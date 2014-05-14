require 'RMagick'
require 'aws/s3'


class ImagesController < ApplicationController
	before_action :set_image, only: [:show, :edit, :download, :save, :update, :destroy]

	# GET /images
	# GET /images.json
	def index
		@images = Image.all
	end



	def show
	end



	def new
		@image = Image.new
	end



	def edit
	end


	def download
		redirect_to @image.url
	end



	def save
		img = Magick::Image.read_inline(params[:imgBase64]).first
		AWS::S3::S3Object.store(@image.s3_filename, img.to_blob, S3_CREDENTIALS[:bucket_name], :access => :public_read)
	end



	def create

		# Read Image
		image = params[:image][:file]
		filename = image.original_filename
		img = Magick::Image.from_blob(image.read).first
		width = img.columns
		height = img.rows

		# Crop Image
		if width > height
			img = img.crop((width-height)/2.truncate, 0, height, height)
		elsif height > width
			img = img.crop(0, (height-width)/2.truncate, width, width)
		end
		
		# Scale Image
		img = img.scale(400,400)

		# Upload
		AWS::S3::S3Object.store(filename, img.to_blob, S3_CREDENTIALS[:bucket_name], :access => :public_read)
		url = AWS::S3::S3Object.url_for(filename, S3_CREDENTIALS[:bucket_name], :authenticated => false)

		@image = Image.new :url => url, :s3_filename => filename, :name => params[:image][:name]



		respond_to do |format|
			if @image.save
				format.html { redirect_to @image, notice: 'Image was successfully created.' }
				format.json { render action: 'show', status: :created, location: @image }
			else
				format.html { render action: 'new' }
				format.json { render json: @image.errors, status: :unprocessable_entity }
			end
		end
	end



	def update
		respond_to do |format|
			if @image.update(image_params)
				format.html { redirect_to @image, notice: 'Image was successfully updated.' }
				format.json { head :no_content }
			else
				format.html { render action: 'edit' }
				format.json { render json: @image.errors, status: :unprocessable_entity }
			end
		end
	end



	def destroy
		AWS::S3::S3Object.find(@image.s3_filename, S3_CREDENTIALS[:bucket_name]).delete
		@image.destroy
		respond_to do |format|
			format.html { redirect_to images_url }
			format.json { head :no_content }
		end
	end



	private
		# Use callbacks to share common setup or constraints between actions.
		def set_image
			@image = Image.find(params[:id])
		end

		# Never trust parameters from the scary internet, only allow the white list through.
		def image_params
			params.require(:image).permit(:name, :s3_filename, :url)
		end
end
