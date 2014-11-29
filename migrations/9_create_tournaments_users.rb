Sequel.migration do
  up do
    create_table(:tournaments_users) do
      Integer  :tournament_id, :null=>false
      Integer  :user_id, :null=>false
      foreign_key  [:tournament_id], :tournaments, :key=>:id, :foreign_key_constraint_name=>'fk_tournament_member', :name=>'tournaments_users_tournaments_tournamens_fkey'
      foreign_key  [:user_id], :users, :key=>:id, :foreign_key_constraint_name=>'fk_user_member', :name=>'tournaments_users_user_user_fkey'
    end
  end

  down do
    drop_table(:tournaments_users)
  end
end