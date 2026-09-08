// Functional groups map directly to the numbered model components.
export const layers={
oil:[
 ['Drilling & well access',[0,1],'Reach the reservoir','The derrick handles drilling equipment. Wellheads and risers connect the wells to the facility. Drilling creates access; production handles fluids from completed wells.'],
 ['Processing',[2],'Separate the well fluids','Separators divide the incoming mixture into oil, gas and water before further treatment and export. Trace the connections from the well-access system.'],
 ['Safety & people',[3,4],'Support offshore operations','The flare carries designated gas releases away from the deck. Accommodation and the helideck support personnel. These are selected features, not a complete safety-system design.'],
 ['Structure',[5],'Carry the loads','The jacket transfers deck and equipment loads towards the seabed foundations. It supports the plant but does not carry produced fluids.']],
flng:[
 ['Gas processing',[0,1,2],'From subsea gas to LNG','Risers bring gas aboard. Pre-treatment removes unwanted substances before the liquefaction modules cool the gas into liquid.'],
 ['Storage & transfer',[3,4],'Hold and export the product','LNG is stored in insulated tanks inside the hull and transferred through offloading equipment. The model shows tank-access domes, not a cutaway of the tanks.'],
 ['Marine & utilities',[5],'Keep the floating plant working','The hull, accommodation and utility area support the processing plant. Power and cooling machinery are represented at module level rather than as individual internal components.']],
wind:[
 ['Energy capture',[0],'Turn moving air into rotation','Aerodynamic blades turn the rotor. Follow that movement towards the nacelle.'],
 ['Electrical generation',[1,3],'From rotation to the grid','The drivetrain transfers movement to the generator. Electrical equipment then connects the output to the grid.'],
 ['Support structure',[2],'Elevate and support the rotor','The tower carries machinery above the ground while the foundation transfers its loads into the soil.']],
solar:[
 ['Energy capture',[0],'Convert sunlight into current','PV cells in the modules produce direct-current electricity. Each panel is part of the wider array.'],
 ['Power & storage',[2,3],'Condition and store electricity','The inverter converts DC to AC. Optional batteries hold energy for later use; they do not generate new energy.'],
 ['Mounting structure',[1],'Position the modules','Racks support the panels at a fixed angle. Spacing and orientation influence exposure to sunlight.']],
hydro:[
 ['Water supply',[0,1],'Guide water downhill','The reservoir provides water at a higher level. The intake and penstock direct it towards the turbine.'],
 ['Electrical generation',[2],'Convert water movement','The turbine drives a generator. The open powerhouse allows you to inspect a simplified turbine-generator assembly.'],
 ['Water return',[3],'Reconnect with the river','Water exits through the tailrace after transferring energy. It continues downstream.']],
geothermal:[
 ['Geothermal water',[0,4],'Circulate the underground resource','The production well brings hot water up. Reinjection returns cooled geothermal water underground. Well depth is compressed in this model.'],
 ['Heat conversion',[1,2],'Transfer heat into generation','A heat exchanger warms a separate working fluid. Its vapour drives the turbine-generator without mixing with geothermal water.'],
 ['Cooling circuit',[3],'Close the working-fluid loop','The condenser removes heat so the secondary vapour becomes liquid again and can return to the heat exchanger.']],
tidal:[
 ['Energy capture',[0],'Use tidal currents','Seawater passing the rotor turns its blades. Current strength changes through the tidal cycle.'],
 ['Electrical generation',[1,3],'Send subsea power ashore','The nacelle contains the generator. An export cable takes the electricity towards the shore connection.'],
 ['Seabed support',[2],'Anchor the machinery','The foundation holds the turbine against water loads. The water surface is omitted so you can inspect the underwater structure.']],
biomass:[
 ['Fuel & combustion',[0,1],'Release heat from biomass','The store and conveyor feed solid biomass to the boiler, where combustion raises steam.'],
 ['Electrical generation',[2],'Use steam to drive a generator','Steam expansion rotates a turbine linked to the electrical generator.'],
 ['Exhaust treatment',[3],'Manage combustion exhaust','Treatment equipment removes selected pollutants before the stack releases exhaust. It does not eliminate carbon dioxide.'],
 ['Cooling & return',[4],'Reuse the water','The condenser changes exhaust steam back into water for return to the boiler.']]
};
