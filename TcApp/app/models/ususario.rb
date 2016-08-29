class Ususario < ActiveRecord::Base
	has_many :pesquisas, dependent: :destroy
end
