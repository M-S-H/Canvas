class CreateImages < ActiveRecord::Migration
  def change
    create_table :images do |t|
      t.string :name
      t.string :s3_filename
      t.string :url

      t.timestamps
    end
  end
end
