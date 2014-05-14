AWS::S3::Base.establish_connection!(
	:access_key_id     => S3_CREDENTIALS[:access_key_id],
	:secret_access_key => S3_CREDENTIALS[:secret_access_key]
)