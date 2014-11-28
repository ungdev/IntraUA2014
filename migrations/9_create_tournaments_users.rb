Sequel.migration do
  up do
    create_table(:tournaments_users) do
      Integer  :tournament_id, :null=>false
      Integer  :user_id, :null=>false
      foreign_key  [:tournament_id], :tournaments, :key=>:id, :foreign_key_constraint_name=>'fk_tournament_member'
      foreign_key  [:user_id], :users, :key=>:id, :foreign_key_constraint_name=>'fk_user_member'
    end
  end

  down do
    drop_table(:tournaments_users)
  end
end