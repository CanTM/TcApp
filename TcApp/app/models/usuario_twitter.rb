class UsuarioTwitter < ActiveRecord::Base
	has_many :tweets
	has_many :seguidores
end
