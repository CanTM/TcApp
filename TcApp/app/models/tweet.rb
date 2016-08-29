class Tweet < ActiveRecord::Base
	has_many :pesquisas
	has_many :hashtags
	has_many :retweets
	belongs_to :usuario_twitter
end
