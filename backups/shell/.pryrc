# (C) 2019 Crafted by Roberto Nogueira
# email : roberto.nogueira@tecnogrupo.com.br.com
# trello: robertonogueira17

Pry.config.pager = true
Pry.config.color = true
Pry.config.history.should_save = true

# wrap ANSI codes so Readline knows where the prompt ends
def colour(name, text)
  if Pry.color
    "\001#{Pry::Helpers::Text.send name, '{text}'}\002".sub '{text}', "\002#{text}\001"
  else
    text
  end
end

Pry.config.prompt = [
    proc do |object, nest_level, pry|
      prompt  = colour :bright_black, Pry.view_clip(object)
      prompt += ":#{nest_level}" if nest_level > 0
      prompt += colour :green, " #{_db}"
      prompt += colour :cyan, " > "
    end, proc { |object, nest_level, pry| colour :cyan, "> " }
]

# tell Readline when the window resizes
old_winch = trap 'WINCH' do
  if `stty size` =~ /\A(\d+) (\d+)\n\z/
    Readline.set_screen_size $1.to_i, $2.to_i
  end
  old_winch.call unless old_winch.nil? || old_winch == 'SYSTEM_DEFAULT'
end

# use awesome print for output if available
begin
  require 'awesome_print'
  Pry.config.print = proc do |output, value|
    value = value.to_a if defined?(ActiveRecord) && value.is_a?(ActiveRecord::Relation)
    output.puts value.ai
  end
rescue LoadError => err
  Pry.config.print = Pry::DEFAULT_PRINT
end

def self.method_missing(m, *args, &block)
  class_name = "#{m}".classify.constantize
  if class_name.is_a?(Class) && ActiveRecord::Base.connection.table_exists?("#{m}")
    case class_name.to_s
    when 'ServiceGrid'
        if args[0].present?
          service_id = args[0]

          grid_ids = ServiceGrid.where(service_id: service_id).pluck(:grid_id)
          puts
          tp Grid.where(id: grid_ids), :id, :name
        else
          puts
          puts "service_grids <service_id>"
        end
    else
        if (class_name.respond_to? 'name') && (class_name.all.count < 100)
          puts
          tp class_name.all, :id, :name
        else
          puts
          tp class_name.all.limit(20), class_name.column_names[0..8]
        end
    end
  end
end

def _log
  Logger::INFO
end

def _log_off
  @old_logger = ActiveRecord::Base.logger
  ActiveRecord::Base.logger = nil
end

def _log_on
  ActiveRecord::Base.logger = @old_logger
end

def _db
  ActiveRecord::Base.connection.current_database
end

def _db_config
  ActiveRecord::Base.connection_config
end

_log_off
$PROJECT_ID = 319

module Demo
  def _demo
    @current_user = User.find(1)
    @current_access = Access.find(17)
    @current_profile = Profile.find(2)
    @current_agency = Agency.find(3)
    @projects = Project.default_access(@current_access, @current_user, @current_profile, @current_agency, opts={status: 1})
  end
end

module OrderingGrids
  def _service_grids(project_id=$PROJECT_ID)
  service_grid_ids = Project.find(project_id).service.service_grids.pluck(:grid_id)
  module_adder_grids = ModuleAdderGrid.joins(:grid).where(grid_id: service_grid_ids).order(:position).pluck(:name)
  end
end

#947-24-criar-area-administrativa-de-grids
module RequestReasonAndGrids
  def _service_ids_that_include_request_reason_grid
    grid = Grid.find_by(active: true, name: 'Identificação da Solicitação')
    if grid.present?
      service_ids= ServiceGrid.joins(:grid).where(grid_id: grid.id).pluck(:service_id)
      tp Service.where(id: service_ids), :id, :name
    end
  end

  def _request_reasons_from_motive_and_service_associations(service_id)
    request_reason_ids = MotiveAndServiceAssociation.where(service_id: service_id).pluck(:request_reason_id)
    if request_reason_ids.present?
      tp RequestReason.where(id: request_reason_ids, active: true), :id , :name
    end
  end

  def _service_grids(service_id)
    grid_ids = ServiceGrid.where(service_id: service_id).pluck(:grid_id)
    tp Grid.where(id: grid_ids), :id, :name
  end
end

# include Demo
# include OrderingGrids
# include RequestReasonAndGrids