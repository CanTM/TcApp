class Pesquisa < ActiveRecord::Base
	belongs_to :usuario
	has_many :palavra_chaves
	has_many :tweets
end
